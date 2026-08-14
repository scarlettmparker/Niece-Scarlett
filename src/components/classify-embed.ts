import type { APIEmbed } from "discord.js";
import type { TextLevelAssessment } from "~/generated/graphql.js";
import { weightedLevelLabel } from "~/utils/cefr.js";
import { EmbedMessage } from "./embed.js";

/**
 * Builds the embed describing a CEFR assessment.
 *
 * @param assessment the predicted assessment
 */
export function buildClassifyEmbed(assessment: TextLevelAssessment): APIEmbed {
  const weighted = weightedLevelLabel(assessment.probabilities);
  const probabilities = [...assessment.probabilities]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .map((p) => `${p.level}: ${(p.probability * 100).toFixed(0)}%`)
    .join(" · ");

  return new EmbedMessage()
    .setTitle(`Estimated level: ${weighted ?? assessment.level}`)
    .setBody(`**Probabilities**\n${probabilities}`)
    .build();
}
