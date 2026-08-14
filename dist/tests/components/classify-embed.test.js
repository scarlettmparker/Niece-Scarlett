import { describe, expect, it } from "vitest";
import { buildClassifyEmbed, probabilityBar } from "~/components/classify-embed.js";
import { CefrLevel } from "~/generated/graphql.js";
const assessment = {
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
describe("probabilityBar", () => {
    it("renders the probability as a gauge", () => {
        expect(probabilityBar(1)).toBe("▰▰▰▰▰");
        expect(probabilityBar(0)).toBe("▱▱▱▱▱");
        expect(probabilityBar(0.62)).toBe("▰▰▰▱▱");
    });
});
describe("buildClassifyEmbed", () => {
    it("shows the level, confidence, and top factors", () => {
        const embed = buildClassifyEmbed(assessment);
        expect(embed.title).toBe("CEFR Level: B2");
        expect(embed.description).toContain("62%");
        expect(embed.description).toContain("B2: 62%");
        expect(embed.description).toContain("↑ Sentence length");
        expect(embed.description).toContain("↑ Rare vocabulary");
        expect(embed.description).toContain("↓ Vocabulary diversity");
    });
});
