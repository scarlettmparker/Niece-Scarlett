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
  it("labels the nearest level when the value is partway out", () => {
    const weighted = weightedLevelLabel([
      p(CefrLevel.A1, 0.3),
      p(CefrLevel.A2, 0.7),
    ]);
    expect(weighted).toBe("low A2");
  });

  it("labels a value just past a level as high of that level", () => {
    expect(
      weightedLevelLabel([p(CefrLevel.B1, 0.7), p(CefrLevel.B2, 0.3)])
    ).toBe("high B1");
  });

  it("returns the plain level when the weight lands on a whole step", () => {
    expect(weightedLevelLabel([p(CefrLevel.C2, 1)])).toBe("C2");
  });

  it("reads a C1-heavy spread as low C1, not high B2", () => {
    const weighted = weightedLevelLabel([
      p(CefrLevel.A1, 0.05),
      p(CefrLevel.A2, 0.04),
      p(CefrLevel.B1, 0.04),
      p(CefrLevel.B2, 0.14),
      p(CefrLevel.C1, 0.41),
      p(CefrLevel.C2, 0.32),
    ]);
    expect(weighted).toBe("low C1");
  });

  it("returns null for empty or zero probabilities", () => {
    expect(weightedLevelLabel([])).toBeNull();
    expect(weightedLevelLabel([p(CefrLevel.A1, 0)])).toBeNull();
  });
});
