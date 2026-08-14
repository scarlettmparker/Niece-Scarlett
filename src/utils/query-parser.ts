import { STOP_WORDS } from "~/utils/intents.js";
import type {
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

  const isStop = (token: string) =>
    STOP_WORDS.has(token) || excludeSet.has(token) || token === "and" || token === "or";
  const isControl = (token: string) =>
    pageAliases.has(token) ||
    fieldAliasMap.has(token) ||
    sortFieldMap.has(token) ||
    operatorMap.has(token) ||
    directionMap.has(token) ||
    token === "sort" ||
    token === "filter" ||
    token === "by" ||
    token === "on";

  const parseFilter = (
    tokens: string[],
    valueStart: number,
    fieldName: string,
    explicitOperator?: QueryOperator
  ): number => {
    const config = schema.fields[fieldName];
    let operator = explicitOperator ?? config.defaultOperator ?? "EQUALS";
    let j = valueStart;
    if (!explicitOperator && operatorMap.has(tokens[j])) {
      operator = operatorMap.get(tokens[j])!;
      j++;
    }
    const values: string[] = [];
    while (j < tokens.length) {
      const token = tokens[j];
      if (token === "and" || token === "or") {
        j++;
        continue;
      }
      if (isStop(token) || isControl(token)) break;
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
  };

  const parseSearch = (tokens: string[], valueStart: number): number => {
    let j = valueStart;
    while (j < tokens.length && !isControl(tokens[j]) && !isStop(tokens[j])) {
      searchTokens.push(unkey(tokens[j]));
      j++;
    }
    return j;
  };

  const parseSort = (tokens: string[], start: number): number => {
    let j = start;
    if (tokens[j] === "by" || tokens[j] === "on") j++;
    let field: string | undefined;
    let direction: "ASC" | "DESC" | undefined;

    const fieldToken = tokens[j];
    if (sortFieldMap.has(fieldToken)) {
      const info = sortFieldMap.get(fieldToken)!;
      field = info.field;
      direction = info.direction;
      j++;
      if (!direction && directionMap.has(tokens[j])) {
        direction = directionMap.get(tokens[j])!;
        j++;
      }
    } else if (directionMap.has(fieldToken)) {
      direction = directionMap.get(fieldToken)!;
      j++;
      if (tokens[j] === "on" || tokens[j] === "by") j++;
      if (sortFieldMap.has(tokens[j])) {
        const info = sortFieldMap.get(tokens[j])!;
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
      i = parseSort(tokens, token === "sort" ? i + 1 : i);
      continue;
    }
    const fieldName = fieldAliasMap.get(token);
    if (fieldName) {
      i = parseFilter(tokens, i + 1, fieldName);
      continue;
    }
    if (schema.defaultSearchField && operatorMap.has(token)) {
      i = parseSearch(tokens, i + 1);
      continue;
    }
    if (!isStop(token) && !isControl(token)) {
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
