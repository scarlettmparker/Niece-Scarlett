import { CefrLevel, type LevelProbability } from "~/generated/graphql.js";

const CEFR_SCALE: Record<CefrLevel, number> = {
  [CefrLevel.A1]: 1,
  [CefrLevel.A2]: 2,
  [CefrLevel.B1]: 3,
  [CefrLevel.B2]: 4,
  [CefrLevel.C1]: 5,
  [CefrLevel.C2]: 6,
};

const CEFR_LABELS: Record<number, string> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

/**
 * Maps a predicted level to its position on the CEFR scale.
 *
 * @param level the level
 */
export function cefrScale(level: CefrLevel): number {
  return CEFR_SCALE[level];
}

/**
 * Computes the probability-weighted CEFR estimate as a friendly label like
 * "high A1" or "mid A2", or a plain level like "B1" when it lands exactly.
 *
 * @param probabilities the predicted level probabilities
 * @return the weighted label, or null when there is nothing to weigh
 */
export function weightedLevelLabel(probabilities: LevelProbability[]): string | null {
  const total = probabilities.reduce((sum, p) => sum + p.probability, 0);
  if (total <= 0) {
    return null;
  }
  const weighted =
    probabilities.reduce((sum, p) => sum + CEFR_SCALE[p.level] * p.probability, 0) /
    total;
  const whole = Math.min(6, Math.max(1, Math.floor(weighted)));
  const label = CEFR_LABELS[whole];
  const frac = weighted - whole;
  if (frac === 0) {
    return label;
  }
  const band = frac < 1 / 3 ? "low " : frac < 2 / 3 ? "mid " : "high ";
  return `${band}${label}`;
}
