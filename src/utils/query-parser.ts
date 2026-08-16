import { STOP_WORDS } from "~/utils/intents.js";
import type {
  QueryFieldConfig,
  QueryOperator,
  QuerySchema,
  QuerySpec,
} from "~/types/query.js";

const OPERATOR_WORDS: Record<QueryOperator, string[]> = {
  EQUALS: ["is", "equals", "equal"],
  NOT_EQUALS: ["is not", "isn't", "not", "not equal"],
  MATCHES: ["has", "contains", "containing", "about", "with", "matches"],
  STARTS_WITH: ["starts with", "starting with", "begins with"],
  ENDS_WITH: ["ends with", "ending with"],
  GREATER_THAN: ["greater than", "more than"],
  LESS_THAN: ["less than", "fewer than"],
  GREATER_THAN_OR_EQUAL: ["at least"],
  LESS_THAN_OR_EQUAL: ["at most"],
  IN: ["in", "among", "one of"],
};

const DIRECTION_WORDS: Record<"ASC" | "DESC", string[]> = {
  ASC: ["alphabetically", "ascending", "asc", "a-z", "αλφαβητικά"],
  DESC: ["descending", "desc", "reverse", "z-a", "φθίνουσα"],
};

const WORD_TO_OPERATOR = new Map<string, QueryOperator>();
for (const [operator, words] of Object.entries(OPERATOR_WORDS)) {
  for (const word of words) WORD_TO_OPERATOR.set(key(word), operator as QueryOperator);
}

const WORD_TO_DIRECTION = new Map<string, "ASC" | "DESC">();
for (const [direction, words] of Object.entries(DIRECTION_WORDS)) {
  for (const word of words) WORD_TO_DIRECTION.set(key(word), direction as "ASC" | "DESC");
}

const DEFAULT_PAGE_ALIASES = ["page", "σελίδα"];

/**
 * Converts a phrase into a single-token key with underscores.
 *
 * @param phrase the phrase
 */
function key(phrase: string): string {
  return phrase.replace(/ /g, "_");
}

/**
 * Converts a keyed token back to a spaced phrase.
 *
 * @param token the token
 */
function unkey(token: string): string {
  return token.replace(/_/g, " ");
}

/**
 * Escapes a string for use in a regular expression.
 *
 * @param value the literal string
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Collects every known multi-word phrase to substitute before tokenizing.
 *
 * @param schema the query schema
 * @param excludeWords the intent trigger words to drop from free text
 */
function collectPhrases(schema: QuerySchema, excludeWords: string[]): string[] {
  const phrases = new Set<string>();
  const add = (list: string[] | undefined) => {
    for (const item of list ?? []) {
      if (item.includes(" ")) phrases.add(item);
    }
  };
  add(schema.pageAliases);
  for (const field of Object.values(schema.fields)) add(field.aliases);
  for (const sortField of Object.values(schema.sort?.fields ?? {})) add(sortField.aliases);
  for (const words of Object.values(OPERATOR_WORDS)) add(words);
  for (const words of Object.values(DIRECTION_WORDS)) add(words);
  for (const words of Object.values(schema.sort?.directionWords ?? {})) add(words);
  for (const word of [...excludeWords, ...STOP_WORDS]) {
    if (word.includes(" ")) phrases.add(word);
  }
  return [...phrases].sort((a, b) => b.length - a.length);
}

/**
 * Whether a token is a stop word or excluded trigger word.
 *
 * @param token the keyed token
 * @param excludeSet the excluded trigger words
 */
function isStopWord(token: string, excludeSet: Set<string>): boolean {
  return STOP_WORDS.has(token) || excludeSet.has(token) || token === "and" || token === "or";
}

type ControlContext = {
  /**
   * Page alias tokens keyed by their underscore form.
   */
  pageAliases: Set<string>;
  /**
   * Field alias tokens mapped to their canonical field name.
   */
  fieldAliasMap: Map<string, string>;
  /**
   * Sort alias tokens mapped to their field and optional direction.
   */
  sortFieldMap: Map<string, { field: string; direction?: "ASC" | "DESC" }>;
  /**
   * Operator trigger words mapped to their QueryOperator.
   */
  operatorMap: Map<string, QueryOperator>;
  /**
   * Direction trigger words mapped to ASC or DESC.
   */
  directionMap: Map<string, "ASC" | "DESC">;
  /**
   * Intent trigger words to exclude from free text.
   */
  excludeSet: Set<string>;
};

/**
 * Whether a token is a structural keyword (page alias, field name, operator,
 * sort direction, or the bare words "sort", "filter", "by", "on").
 *
 * @param token the keyed token
 * @param ctx the control-word lookup context
 */
function isControlWord(token: string, ctx: ControlContext): boolean {
  return (
    ctx.pageAliases.has(token) ||
    ctx.fieldAliasMap.has(token) ||
    ctx.sortFieldMap.has(token) ||
    ctx.operatorMap.has(token) ||
    ctx.directionMap.has(token) ||
    token === "sort" ||
    token === "filter" ||
    token === "by" ||
    token === "on"
  );
}

/**
 * Parses a filter clause starting at valueStart for the given field.
 *
 * @param tokens the tokenized input
 * @param valueStart index of the first value token
 * @param fieldName the resolved field name
 * @param explicitOperator an operator already consumed by the caller
 * @param config the field configuration from the schema
 * @param ctx the control-word lookup context
 * @param spec the spec to mutate
 * @return the next token index after the filter
 */
function parseFilter(
  tokens: string[],
  valueStart: number,
  fieldName: string,
  explicitOperator: QueryOperator | undefined,
  config: QueryFieldConfig,
  ctx: ControlContext,
  spec: QuerySpec,
): number {
  let operator = explicitOperator ?? config.defaultOperator ?? "EQUALS";
  let j = valueStart;
  if (!explicitOperator && ctx.operatorMap.has(tokens[j])) {
    operator = ctx.operatorMap.get(tokens[j])!;
    j++;
  }
  const values: string[] = [];
  while (j < tokens.length) {
    const token = tokens[j];
    if (token === "and" || token === "or") {
      j++;
      continue;
    }
    if (isStopWord(token, ctx.excludeSet) || isControlWord(token, ctx)) break;
    if (config.values) {
      const canonical = config.values[unkey(token)];
      if (!canonical) break;
      values.push(canonical);
    } else {
      values.push(unkey(token));
    }
    j++;
  }
  if (values.length === 0) {
    return valueStart;
  }
  spec.filters.push({
    field: fieldName,
    operator: values.length > 1 ? "IN" : operator,
    value: values.join(","),
  });
  return j;
}

/**
 * Parses free-text tokens into the search accumulator.
 *
 * @param tokens the tokenized input
 * @param valueStart index of the first search token
 * @param searchTokens accumulator for search terms
 * @param ctx the control-word lookup context
 * @return the next token index after the search terms
 */
function parseSearch(
  tokens: string[],
  valueStart: number,
  searchTokens: string[],
  ctx: ControlContext,
): number {
  let j = valueStart;
  while (j < tokens.length && !isControlWord(tokens[j], ctx) && !isStopWord(tokens[j], ctx.excludeSet)) {
    searchTokens.push(unkey(tokens[j]));
    j++;
  }
  return j;
}

/**
 * Parses a sort clause starting at start.
 *
 * @param tokens the tokenized input
 * @param start index of the first sort token
 * @param schema the query schema
 * @param ctx the control-word lookup context
 * @param spec the spec to mutate
 * @return the next token index after the sort clause
 */
function parseSort(
  tokens: string[],
  start: number,
  schema: QuerySchema,
  ctx: ControlContext,
  spec: QuerySpec,
): number {
  let j = start;
  if (tokens[j] === "by" || tokens[j] === "on") j++;
  let field: string | undefined;
  let direction: "ASC" | "DESC" | undefined;

  const fieldToken = tokens[j];
  if (ctx.sortFieldMap.has(fieldToken)) {
    const info = ctx.sortFieldMap.get(fieldToken)!;
    field = info.field;
    direction = info.direction;
    j++;
    if (!direction && ctx.directionMap.has(tokens[j])) {
      direction = ctx.directionMap.get(tokens[j])!;
      j++;
    }
  } else if (ctx.directionMap.has(fieldToken)) {
    direction = ctx.directionMap.get(fieldToken)!;
    j++;
    if (tokens[j] === "on" || tokens[j] === "by") j++;
    if (ctx.sortFieldMap.has(tokens[j])) {
      const info = ctx.sortFieldMap.get(tokens[j])!;
      field = info.field;
      if (!direction) direction = info.direction;
      j++;
    }
  }

  const resolvedField = field ?? schema.sort?.default?.by;
  if (!resolvedField) {
    return j;
  }
  const resolvedDirection =
    direction ??
    schema.sort?.fields[resolvedField]?.defaultDirection ??
    schema.sort?.default?.dir ??
    "ASC";
  spec.sort = { by: resolvedField, dir: resolvedDirection };
  return j;
}

/**
 * Parses a natural-language utterance into a query spec.
 *
 * @param utterance the phrase after the command
 * @param schema the query schema for the command
 * @param excludeWords the intent trigger words to drop from free text
 */
export function parseQuerySpec(
  utterance: string,
  schema: QuerySchema,
  excludeWords: string[]
): QuerySpec {
  const phrases = collectPhrases(schema, excludeWords);
  let normalized = ` ${utterance.toLowerCase()} `;
  for (const phrase of phrases) {
    normalized = normalized.replace(
      new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "g"),
      key(phrase)
    );
  }
  const tokens = normalized.trim().split(/\s+/).filter(Boolean);

  const spec: QuerySpec = { page: 0, filters: [], search: undefined };
  const searchTokens: string[] = [];
  const pageAliases = new Set((schema.pageAliases ?? DEFAULT_PAGE_ALIASES).map(key));
  const fieldAliasMap = new Map<string, string>();
  for (const [fieldName, field] of Object.entries(schema.fields)) {
    for (const alias of field.aliases) fieldAliasMap.set(key(alias), fieldName);
  }
  const sortFieldMap = new Map<string, { field: string; direction?: "ASC" | "DESC" }>();
  for (const [fieldName, sortField] of Object.entries(schema.sort?.fields ?? {})) {
    for (const alias of sortField.aliases) {
      sortFieldMap.set(key(alias), {
        field: fieldName,
        direction: sortField.aliasDirections?.[alias],
      });
    }
  }
  const operatorMap = new Map(WORD_TO_OPERATOR);
  const directionMap = new Map(WORD_TO_DIRECTION);
  for (const [dir, words] of Object.entries(schema.sort?.directionWords ?? {})) {
    for (const word of words) directionMap.set(key(word), dir as "ASC" | "DESC");
  }
  const excludeSet = new Set(excludeWords.map(key));

  const ctx: ControlContext = {
    pageAliases,
    fieldAliasMap,
    sortFieldMap,
    operatorMap,
    directionMap,
    excludeSet,
  };

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (pageAliases.has(token)) {
      const pageNumber = Number(tokens[i + 1]);
      if (Number.isInteger(pageNumber) && pageNumber > 0) {
        spec.page = pageNumber - 1;
        i += 2;
        continue;
      }
    }
    if (token === "filter") {
      if (tokens[i + 1] === "by" || tokens[i + 1] === "on") {
        i++;
      }
      i++;
      continue;
    }
    if (token === "sort" || directionMap.has(token)) {
      i = parseSort(tokens, token === "sort" ? i + 1 : i, schema, ctx, spec);
      continue;
    }
    const fieldName = fieldAliasMap.get(token);
    if (fieldName) {
      const config = schema.fields[fieldName];
      i = parseFilter(tokens, i + 1, fieldName, undefined, config, ctx, spec);
      continue;
    }
    if (schema.defaultSearchField && operatorMap.has(token)) {
      i = parseSearch(tokens, i + 1, searchTokens, ctx);
      continue;
    }
    if (!isStopWord(token, excludeSet) && !isControlWord(token, ctx)) {
      searchTokens.push(unkey(token));
    }
    i++;
  }

  if (searchTokens.length > 0) {
    const search = searchTokens.join(" ");
    spec.search = search;
    if (schema.defaultSearchField) {
      spec.filters.push({
        field: schema.defaultSearchField,
        operator: schema.searchOperator ?? "MATCHES",
        value: search,
      });
    }
  }
  return spec;
}
