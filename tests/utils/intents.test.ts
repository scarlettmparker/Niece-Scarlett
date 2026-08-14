import { describe, expect, it } from "vitest";
import { resolveIntent, tokenize, type CommandIntent } from "~/utils/intents.js";

const intents: CommandIntent[] = [
  {
    name: "texts",
    command: "texts",
    words: ["texts", "reader", "reading", "stories", "browse"],
  },
  {
    name: "text",
    command: "text",
    words: ["text", "find", "search", "locate", "story", "read"],
  },
  {
    name: "lt",
    command: "lt",
    words: ["language", "transfer", "greek", "course", "learn", "lt"],
  },
];

describe("tokenize", () => {
  it("lowers and strips punctuation", () => {
    expect(tokenize("Give me TEXTS!")).toEqual(["texts"]);
  });

  it("drops stop words", () => {
    expect(tokenize("what is language transfer")).toEqual(["language", "transfer"]);
  });

  it("returns no words for stop words only", () => {
    expect(tokenize("please give me the")).toEqual([]);
  });
});

describe("resolveIntent", () => {
  it("resolves a natural utterance to the texts intent", () => {
    expect(resolveIntent("give me texts", intents)?.command).toBe("texts");
  });

  it("resolves a natural utterance to the text intent", () => {
    expect(resolveIntent("find me a story to read", intents)?.command).toBe("text");
  });

  it("resolves a natural utterance to the lt intent", () => {
    expect(resolveIntent("what is language transfer", intents)?.command).toBe("lt");
  });

  it("returns null when nothing matches", () => {
    expect(resolveIntent("play the guitar", intents)).toBeNull();
  });

  it("tolerates a typo in the trigger word", () => {
    expect(resolveIntent("give me textsd", intents)?.command).toBe("texts");
  });

  it("tolerates a shortened trigger word", () => {
    expect(resolveIntent("txts", intents)?.command).toBe("texts");
  });

  it("tolerates a typo in a multi-word utterance", () => {
    expect(resolveIntent("what is langugae transfer", intents)?.command).toBe("lt");
  });

  it("prefers an exact match over a fuzzy one", () => {
    expect(resolveIntent("texts", intents)?.command).toBe("texts");
  });

  it("does not match a distant word", () => {
    expect(resolveIntent("textbooks", intents)).toBeNull();
  });
});
