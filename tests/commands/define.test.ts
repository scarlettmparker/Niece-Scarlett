import { describe, expect, it } from "vitest";
import { WordScope } from "~/generated/graphql.js";
import { parseDefineScope, splitDefineArgs } from "~/commands/define.js";

describe("parseDefineScope", () => {
  it("parses individual scopes", () => {
    expect(parseDefineScope("examples")).toEqual([WordScope.Examples]);
    expect(parseDefineScope("all translations")).toEqual([WordScope.AllTranslations]);
    expect(parseDefineScope("compounds")).toEqual([WordScope.Compounds]);
    expect(parseDefineScope("related")).toEqual([WordScope.RelatedWords]);
  });

  it("parses combined scopes in canonical order", () => {
    expect(parseDefineScope("examples and every translation and compounds")).toEqual([
      WordScope.AllTranslations,
      WordScope.Examples,
      WordScope.Compounds,
    ]);
  });

  it("returns nothing for an empty scope", () => {
    expect(parseDefineScope("")).toEqual([]);
  });
});

describe("splitDefineArgs", () => {
  it("splits the word from the scope text", () => {
    expect(splitDefineArgs(["γεια", "with", "examples"])).toEqual({
      word: "γεια",
      scopeText: "examples",
    });
  });

  it("keeps the whole invocation as the word without a with clause", () => {
    expect(splitDefineArgs(["γεια"])).toEqual({ word: "γεια", scopeText: "" });
  });

  it("drops intent trigger words and stop words from the word", () => {
    expect(splitDefineArgs(["what", "does", "γεια", "mean"], ["mean"])).toEqual({
      word: "γεια",
      scopeText: "",
    });
    expect(splitDefineArgs(["define", "γεια", "with", "examples"], ["define"])).toEqual({
      word: "γεια",
      scopeText: "examples",
    });
  });
});
