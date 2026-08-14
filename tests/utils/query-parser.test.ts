import { describe, expect, it } from "vitest";
import { parseQuerySpec } from "~/utils/query-parser.js";
import { specToPagination } from "~/utils/query-pagination.js";
import { FilterOperator, SortDirection } from "~/generated/graphql.js";
import type { QuerySchema } from "~/types/query.js";

const schema: QuerySchema = {
  fields: {
    title: { aliases: ["title", "name"] },
    level: {
      aliases: ["level", "levels", "difficulty"],
      defaultOperator: "IN",
      values: {
        a1: "A1", a2: "A2", b1: "B1", b2: "B2", c1: "C1", c2: "C2",
        α1: "A1", α2: "A2", β1: "B1", β2: "B2", γ1: "C1", γ2: "C2",
      },
    },
    language: { aliases: ["language", "lang"] },
    createdAt: { aliases: ["created at", "created"] },
    updatedAt: { aliases: ["updated at", "updated"] },
  },
  sort: {
    fields: {
      title: { aliases: ["title", "name", "alphabetical", "alphabetically"] },
      level: { aliases: ["level", "difficulty"] },
      language: { aliases: ["language", "lang"] },
      createdAt: {
        aliases: ["created", "created at", "newest"],
        aliasDirections: { newest: "DESC" },
      },
      updatedAt: {
        aliases: ["updated", "updated at", "recently updated"],
        aliasDirections: { "recently updated": "DESC" },
      },
    },
    default: { by: "level", dir: "ASC" },
  },
  defaultSearchField: "title",
};

describe("parseQuerySpec", () => {
  it("parses a page number", () => {
    const spec = parseQuerySpec("page 3", schema, []);
    expect(spec.page).toBe(2);
    expect(spec.filters).toEqual([]);
  });

  it("parses the greek page alias", () => {
    expect(parseQuerySpec("σελίδα 2", schema, []).page).toBe(1);
  });

  it("parses a filter clause with a filter prefix and plural alias", () => {
    expect(parseQuerySpec("filter on levels a2", schema, []).filters).toEqual([
      { field: "level", operator: "IN", value: "A2" },
    ]);
  });

  it("keeps a single level value on the default operator", () => {
    expect(parseQuerySpec("level a1", schema, []).filters).toEqual([
      { field: "level", operator: "IN", value: "A1" },
    ]);
  });

  it("unions same-field values with IN", () => {
    expect(parseQuerySpec("level a1 or b2", schema, []).filters).toEqual([
      { field: "level", operator: "IN", value: "A1,B2" },
    ]);
  });

  it("maps greek level aliases to the schema values", () => {
    expect(parseQuerySpec("level α2 or γ1", schema, []).filters).toEqual([
      { field: "level", operator: "IN", value: "A2,C1" },
    ]);
  });

  it("applies an explicit operator to a field", () => {
    expect(parseQuerySpec("title has γεια", schema, []).filters).toEqual([
      { field: "title", operator: "MATCHES", value: "γεια" },
    ]);
  });

  it("filters free text against the default search field", () => {
    const spec = parseQuerySpec("γεια σου", schema, []);
    expect(spec.search).toBe("γεια σου");
    expect(spec.filters).toEqual([
      { field: "title", operator: "MATCHES", value: "γεια σου" },
    ]);
  });

  it("parses a direction-only sort using the default field", () => {
    expect(parseQuerySpec("sort alphabetically", schema, []).sort).toEqual({
      by: "title",
      dir: "ASC",
    });
  });

  it("parses a field sort with an explicit field", () => {
    expect(parseQuerySpec("sort by title", schema, []).sort).toEqual({
      by: "title",
      dir: "ASC",
    });
  });

  it("parses an alias direction for createdAt", () => {
    expect(parseQuerySpec("sort newest", schema, []).sort).toEqual({
      by: "createdAt",
      dir: "DESC",
    });
  });

  it("parses a multi-word alias direction for updatedAt", () => {
    expect(parseQuerySpec("sort recently updated", schema, []).sort).toEqual({
      by: "updatedAt",
      dir: "DESC",
    });
  });

  it("combines a filter and a sort", () => {
    const spec = parseQuerySpec("level b1 sort by title", schema, []);
    expect(spec.filters).toEqual([{ field: "level", operator: "IN", value: "B1" }]);
    expect(spec.sort).toEqual({ by: "title", dir: "ASC" });
  });

  it("drops exclude words and stop words", () => {
    const spec = parseQuerySpec("give me texts level a1", schema, ["texts"]);
    expect(spec.filters).toEqual([{ field: "level", operator: "IN", value: "A1" }]);
  });

  it("treats an excluded trigger word as search", () => {
    const spec = parseQuerySpec("stories about summer", schema, ["stories"]);
    expect(spec.search).toBe("summer");
  });

  it("combines a level filter with free text", () => {
    const spec = parseQuerySpec("level a1 about summer", schema, []);
    expect(spec.filters).toEqual([
      { field: "level", operator: "IN", value: "A1" },
      { field: "title", operator: "MATCHES", value: "summer" },
    ]);
    expect(spec.search).toBe("summer");
  });

  it("parses a filter on another field", () => {
    const spec = parseQuerySpec("language greek sort by difficulty", schema, []);
    expect(spec.filters).toEqual([
      { field: "language", operator: "EQUALS", value: "greek" },
    ]);
    expect(spec.sort).toEqual({ by: "level", dir: "ASC" });
  });
});

describe("specToPagination", () => {
  it("maps a spec to pagination input", () => {
    const pagination = specToPagination({
      page: 2,
      filters: [
        { field: "level", operator: "IN", value: "A1,B2" },
        { field: "title", operator: "MATCHES", value: "summer" },
      ],
      sort: { by: "title", dir: "ASC" },
    });
    expect(pagination.page).toBe(2);
    expect(pagination.size).toBe(10);
    expect(pagination.sortBy).toBe("title");
    expect(pagination.sortDir).toBe(SortDirection.Asc);
    expect(pagination.filters).toEqual([
      { field: "level", operator: FilterOperator.In, value: "A1,B2" },
      { field: "title", operator: FilterOperator.Matches, value: "summer" },
    ]);
  });

  it("falls back to the default sort and a descending direction", () => {
    const pagination = specToPagination({ page: 0, filters: [] }, "createdAt");
    expect(pagination.sortBy).toBe("createdAt");
    expect(pagination.sortDir).toBe(SortDirection.Asc);
  });
});
