import { describe, expect, it, vi } from "vitest";
import {
  helpListEmbed,
  helpDetailEmbed,
  type CommandEntry,
} from "~/components/help-embed.js";

vi.mock("~/translations/index.js", () => ({
  loadTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      "help.title": "Available commands",
      "help.empty": "No commands available.",
      "help.permission": "Permission",
      "help.rate-limit": "Rate limit",
    };
    return map[key] ?? key;
  },
}));

function entry(
  name: string,
  values: Record<string, unknown> = {},
): CommandEntry {
  return { entryName: name, values };
}

describe("helpListEmbed", () => {
  it("shows empty state when no commands", () => {
    const embed = helpListEmbed([]);
    expect(embed.title).toBe("Available commands");
    expect(embed.description).toBe("No commands available.");
  });

  it("lists commands with descriptions", () => {
    const commands = [
      entry("texts", { description: "List reader texts" }),
      entry("classify", { description: "Predict CEFR level" }),
    ];
    const embed = helpListEmbed(commands);
    expect(embed.description).toContain("`texts` · List reader texts");
    expect(embed.description).toContain("`classify` · Predict CEFR level");
  });

  it("lists commands without descriptions", () => {
    const commands = [entry("reload")];
    const embed = helpListEmbed(commands);
    expect(embed.description).toContain("`reload`");
  });
});

describe("helpDetailEmbed", () => {
  it("renders blog post content when provided", () => {
    const embed = helpDetailEmbed(
      entry("texts", { description: "List reader texts" }),
      "Custom help content",
    );
    expect(embed.title).toBe("texts");
    expect(embed.description).toBe("Custom help content");
  });

  it("falls back to auto-generated content", () => {
    const embed = helpDetailEmbed(
      entry("classify", {
        description: "Predict CEFR level",
        permission: "bot.commands.classify",
      }),
    );
    expect(embed.description).toContain("Predict CEFR level");
    expect(embed.description).toContain("Permission");
    expect(embed.description).toContain("bot.commands.classify");
  });

  it("shows global rate limit", () => {
    const embed = helpDetailEmbed(
      entry("define", {
        description: "Define a word",
        rateLimit: { capacity: 1, refillPerSecond: 0.1 },
      }),
    );
    expect(embed.description).toContain("Rate limit");
    expect(embed.description).toContain("1 per 10s");
  });

  it("shows per-channel rate limits", () => {
    const embed = helpDetailEmbed(
      entry("define", {
        description: "Define a word",
        rateLimit: {
          capacity: 1,
          refillPerSecond: 0.0167,
          channels: {
            "354924532479295498": { capacity: 1, refillPerSecond: 0.1 },
          },
        },
      }),
    );
    expect(embed.description).toContain("1 per 60s");
    expect(embed.description).toContain("<#354924532479295498>");
  });

  it("omits permission when absent", () => {
    const embed = helpDetailEmbed(
      entry("texts", { description: "List texts" }),
    );
    expect(embed.description).not.toContain("Permission");
  });
});
