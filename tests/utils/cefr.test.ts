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
  it("ignores distant mass when most of it sits at C1 and B2", () => {
    const weighted = weightedLevelLabel([
      p(CefrLevel.A1, 0.24),
      p(CefrLevel.A2, 0.05),
      p(CefrLevel.B1, 0.05),
      p(CefrLevel.B2, 0.25),
      p(CefrLevel.C1, 0.36),
      p(CefrLevel.C2, 0.05),
    ]);
    expect(weighted).toBe("mid B2");
  });

  it("reads an overwhelmingly dominant level as the plain level", () => {
    expect(
      weightedLevelLabel([
        p(CefrLevel.A1, 0.71),
        p(CefrLevel.A2, 0.06),
        p(CefrLevel.B1, 0.07),
        p(CefrLevel.B2, 0.1),
        p(CefrLevel.C1, 0.06),
      ])
    ).toBe("A1");
  });

  it("keeps an adjacent bump within the band", () => {
    expect(
      weightedLevelLabel([p(CefrLevel.B2, 0.8), p(CefrLevel.C2, 0.2)])
    ).toBe("mid B2");
  });

  it("bands a value partway out of a level", () => {
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

  it("returns null for empty or zero probabilities", () => {
    expect(weightedLevelLabel([])).toBeNull();
    expect(weightedLevelLabel([p(CefrLevel.A1, 0)])).toBeNull();
  });
});
