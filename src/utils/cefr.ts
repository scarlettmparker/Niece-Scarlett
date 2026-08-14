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
 * How close the estimate must be to a whole step before showing it plainly.
 */
const DOMINANT_TOLERANCE = 0.25;

/**
 * How far from the peak level the averaging window extends.
 */
const WINDOW_RADIUS = 2;

/**
 * Maps a predicted level to its position on the CEFR scale.
 *
 * @param level the level
 */
export function cefrScale(level: CefrLevel): number {
  return CEFR_SCALE[level];
}

/**
 * Computes a CEFR estimate as a friendly label like "high A1" or
 * "mid A2", or a plain level like "B1" when it lands on one.
 *
 * @param probabilities the predicted level probabilities
 * @return the weighted label, or null when there is nothing to weigh
 */
export function weightedLevelLabel(
  probabilities: LevelProbability[],
): string | null {
  const mode = modeLevel(probabilities);
  if (mode === null) {
    return null;
  }
  const estimate = windowedEstimate(probabilities, mode);
  return formatEstimate(estimate);
}

/**
 * Returns the level with the highest probability, or null when none exists.
 *
 * @param probabilities the predicted level probabilities
 */
function modeLevel(probabilities: LevelProbability[]): CefrLevel | null {
  let best: LevelProbability | null = null;
  for (const p of probabilities) {
    if (
      p.probability > 0 &&
      (best === null || p.probability > best.probability)
    ) {
      best = p;
    }
  }
  return best?.level ?? null;
}

/**
 * Averages the probabilities within a couple of steps of the mode, renormalized.
 *
 * @param probabilities the predicted level probabilities
 * @param mode the level that peaks the distribution
 */
function windowedEstimate(
  probabilities: LevelProbability[],
  mode: CefrLevel,
): number {
  const center = CEFR_SCALE[mode];
  let mass = 0;
  let weighted = 0;
  for (const p of probabilities) {
    const scale = CEFR_SCALE[p.level];
    if (Math.abs(scale - center) <= WINDOW_RADIUS) {
      mass += p.probability;
      weighted += p.probability * scale;
    }
  }
  return mass > 0 ? weighted / mass : center;
}

/**
 * Formats an estimate as a plain level or a low/mid/high band.
 *
 * @param estimate the estimate on the CEFR scale
 */
function formatEstimate(estimate: number): string {
  const nearest = Math.round(estimate);
  if (Math.abs(estimate - nearest) < DOMINANT_TOLERANCE) {
    return CEFR_LABELS[Math.min(6, Math.max(1, nearest))];
  }
  const floor = Math.min(6, Math.max(1, Math.floor(estimate)));
  const frac = estimate - floor;
  if (frac < 1 / 3) {
    return `high ${CEFR_LABELS[floor]}`;
  }
  if (frac < 2 / 3) {
    return `mid ${CEFR_LABELS[floor]}`;
  }
  return `low ${CEFR_LABELS[Math.min(6, floor + 1)]}`;
}
