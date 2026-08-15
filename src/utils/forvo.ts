import { execFile } from "node:child_process";

const WORD_BASE = "https://forvo.com/word/";
const AUDIO_BASE = "https://audio00.forvo.com/audios/mp3/";

/**
 * Desktop-browser headers so Cloudflare serves the real page.
 */
const PAGE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
  Referer: "https://forvo.com/",
  "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "Upgrade-Insecure-Requests": "1",
};

const EL_LIST_RE = /id="pronunciations-list-el"[\s\S]*?<\/ul>/;
const PLAY_CALL_RE = /Play\(([^)]*)\)/;
const PLAY_ARG_RE = /'([^']*)'/g;

const CHALLENGE_MARKERS = ["Just a moment"];

/**
 * Curl flags that reproduce a desktop browser so Cloudflare serves the page.
 */
const CURL_FLAGS = [
  "-sS",
  "--compressed",
  "-A",
  PAGE_HEADERS["User-Agent"],
  "-H",
  `Accept: ${PAGE_HEADERS.Accept}`,
  "-H",
  `Accept-Language: ${PAGE_HEADERS["Accept-Language"]}`,
  "-H",
  `Referer: ${PAGE_HEADERS.Referer}`,
  "-H",
  `sec-ch-ua: ${PAGE_HEADERS["sec-ch-ua"]}`,
  "-H",
  `sec-ch-ua-mobile: ${PAGE_HEADERS["sec-ch-ua-mobile"]}`,
  "-H",
  `sec-ch-ua-platform: ${PAGE_HEADERS["sec-ch-ua-platform"]}`,
  "-H",
  `Upgrade-Insecure-Requests: ${PAGE_HEADERS["Upgrade-Insecure-Requests"]}`,
];

/**
 * Fetches a URL with curl, or null when the request fails.
 *
 * Node's own fetch is TLS-fingerprinted by Cloudflare and gets challenged,
 * while curl passes.
 *
 * @param url the URL to fetch
 */
function curlText(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      "curl",
      [...CURL_FLAGS, url],
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024, timeout: 15_000 },
      (error, stdout) => {
        resolve(error ? null : stdout);
      },
    );
  });
}

/**
 * Returns the Forvo page URL for a word.
 *
 * @param word the word to look up
 */
export function wordPageUrl(word: string): string {
  return `${WORD_BASE}${encodeURIComponent(word)}/`;
}

/**
 * Extracts the first Modern Greek pronunciation's audio URL from a word page.
 *
 * @param html the word page HTML
 * @return the mp3 URL, or null when there is no Greek entry
 */
export function greekAudioUrl(html: string): string | null {
  const list = EL_LIST_RE.exec(html)?.[0];
  if (!list) {
    return null;
  }
  const call = PLAY_CALL_RE.exec(list)?.[1];
  if (!call) {
    return null;
  }
  const args = [...call.matchAll(PLAY_ARG_RE)].map((match) => match[1]);
  const path =
    args.length >= 3 ? Buffer.from(args[2], "base64").toString("utf-8") : "";
  if (!path.endsWith(".mp3")) {
    return null;
  }
  return `${AUDIO_BASE}${path}`;
}

/**
 * Fetches a word's page, or null when the word does not resolve.
 *
 * @param word the word to look up
 */
export async function fetchWordPage(word: string): Promise<string | null> {
  const html = await curlText(wordPageUrl(word));
  if (!html || CHALLENGE_MARKERS.some((marker) => html.includes(marker))) {
    return null;
  }
  return html;
}

/**
 * Downloads a pronunciation into a buffer.
 *
 * @param url the audio URL
 */
export async function fetchAudio(url: string): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  return Buffer.from(await response.arrayBuffer());
}
