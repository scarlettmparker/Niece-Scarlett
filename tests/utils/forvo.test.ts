import { describe, expect, it } from "vitest";
import { greekAudioUrl, wordPageUrl } from "~/utils/forvo.js";

const EL_URL = "https://audio00.forvo.com/audios/mp3/i/z/iz_9038706_38_1158112_1.mp3";
const EL_B64 = "aS96L2l6XzkwMzg3MDZfMzhfMTE1ODExMl8xLm1wMw==";

describe("wordPageUrl", () => {
  it("encodes the word into the Forvo page URL", () => {
    expect(wordPageUrl("γεια")).toBe(
      "https://forvo.com/word/%CE%B3%CE%B5%CE%B9%CE%B1/"
    );
  });
});

describe("greekAudioUrl", () => {
  it("returns the first Modern Greek entry's audio", () => {
    const html = `<ul id="pronunciations-list-el">
      <li onclick="Play('x','false','${EL_B64}','','h','γεια')"></li>
    </ul>`;
    expect(greekAudioUrl(html)).toBe(EL_URL);
  });

  it("takes the first entry when several exist", () => {
    const other = Buffer.from("o/7/o7_9271336_38_1158112.mp3").toString("base64");
    const html = `<ul id="pronunciations-list-el">
      <li onclick="Play('x','false','${other}','','h','γεια')"></li>
      <li onclick="Play('x','false','${EL_B64}','','h','γεια')"></li>
    </ul>`;
    expect(greekAudioUrl(html)).toBe("https://audio00.forvo.com/audios/mp3/o/7/o7_9271336_38_1158112.mp3");
  });

  it("ignores Ancient Greek entries", () => {
    const html = `<ul id="pronunciations-list-grc">
      <li onclick="Play('x','false','${EL_B64}','','h','λόγος')"></li>
    </ul>`;
    expect(greekAudioUrl(html)).toBeNull();
  });

  it("returns null without a Greek list", () => {
    expect(greekAudioUrl("<p>nothing here</p>")).toBeNull();
  });

  it("returns null for a malformed play call", () => {
    const html = `<ul id="pronunciations-list-el"><li onclick="Play('onlyone')"></li></ul>`;
    expect(greekAudioUrl(html)).toBeNull();
  });
});
