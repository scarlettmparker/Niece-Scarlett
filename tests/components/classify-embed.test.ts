import { describe, expect, it } from "vitest";
import { buildClassifyEmbed } from "~/components/classify-embed.js";
import { CefrLevel, type TextLevelAssessment } from "~/generated/graphql.js";

const assessment: TextLevelAssessment = {
  level: CefrLevel.B2,
  confidence: 0.62,
  probabilities: [
    { level: CefrLevel.A2, probability: 0.1 },
    { level: CefrLevel.B1, probability: 0.28 },
    { level: CefrLevel.B2, probability: 0.62 },
  ],
  factors: [
    { name: "avgSentenceLength", value: 18.5, direction: "up", weight: 0.8 },
    { name: "rareWordRatio", value: 0.3, direction: "up", weight: 0.6 },
    { name: "typeTokenRatio", value: 0.5, direction: "down", weight: 0.4 },
  ],
};

describe("buildClassifyEmbed", () => {
  it("shows the weighted estimate, absolute level, and probabilities", () => {
    const embed = buildClassifyEmbed(assessment);

    expect(embed.title).toBe("Estimated level: mid B1");
    expect(embed.description).toContain("B2: 62%");
    expect(embed.description).not.toContain("Absolute level");
    expect(embed.description).not.toContain("Key factors");
  });
});
