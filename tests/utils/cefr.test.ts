import { describe, expect, it } from "vitest";
import { CefrLevel, type LevelProbability } from "~/generated/graphql.js";
import { cefrScale, weightedLevelLabel } from "~/utils/cefr.js";

const p = (level: CefrLevel, probability: number): LevelProbability => ({
  level,
  probability,
});

describe("cefrScale", () => {
  it("maps levels to their scale position", () => {
    expect(cefrScale(CefrLevel.A1)).toBe(1);
    expect(cefrScale(CefrLevel.C2)).toBe(6);
  });
});

describe("weightedLevelLabel", () => {
  it("weighs probabilities across the scale", () => {
    const weighted = weightedLevelLabel([
      p(CefrLevel.A1, 0.3),
      p(CefrLevel.A2, 0.7),
    ]);
    expect(weighted).toBe("high A1");
  });

  it("returns the plain level when the weight lands on a whole step", () => {
    expect(
      weightedLevelLabel([p(CefrLevel.B1, 0.7), p(CefrLevel.B2, 0.3)])
    ).toBe("low B1");
    expect(weightedLevelLabel([p(CefrLevel.C2, 1)])).toBe("C2");
  });

  it("returns null for empty or zero probabilities", () => {
    expect(weightedLevelLabel([])).toBeNull();
    expect(weightedLevelLabel([p(CefrLevel.A1, 0)])).toBeNull();
  });
});
