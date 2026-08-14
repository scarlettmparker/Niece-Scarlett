import { EmbedMessage } from "./embed.js";
const FACTOR_LABELS = {
    textLength: "Text length",
    avgSentenceLength: "Sentence length",
    longSentenceRatio: "Long sentences",
    avgWordLength: "Word length",
    longWordRatio: "Long words",
    typeTokenRatio: "Vocabulary diversity",
    rareWordRatio: "Rare vocabulary",
    punctuationDensity: "Punctuation",
};
/**
 * Builds the embed describing a CEFR assessment.
 *
 * @param assessment the predicted assessment
 */
export function buildClassifyEmbed(assessment) {
    const bar = probabilityBar(assessment.confidence);
    const probabilities = [...assessment.probabilities]
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3)
        .map((p) => `${p.level}: ${(p.probability * 100).toFixed(0)}%`)
        .join(" · ");
    const factors = assessment.factors
        .slice(0, 3)
        .map((factor) => {
        const label = FACTOR_LABELS[factor.name] ?? factor.name;
        const arrow = factor.direction === "up" ? "↑" : "↓";
        return `${arrow} ${label}`;
    })
        .join("\n");
    return new EmbedMessage()
        .setTitle(`CEFR Level: ${assessment.level}`)
        .setBody(`${bar} ${(assessment.confidence * 100).toFixed(0)}%\n\n**Probabilities**\n${probabilities}\n\n**Key factors**\n${factors}`)
        .build();
}
/**
 * Renders a probability as a five-bar gauge.
 *
 * @param probability the probability in [0, 1]
 */
export function probabilityBar(probability) {
    const filled = Math.round(probability * 5);
    return "▰".repeat(filled) + "▱".repeat(5 - filled);
}
