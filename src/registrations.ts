import { configureApi } from "@sun/api";
import { configurePageData } from "@sun/ssr";
import { apiKey, clientId, clientSecret } from "~/config.js";
import "./data/texts-data.js";
import "./data/text-data.js";
import "./data/command-intents-data.js";
import "./data/blog-data.js";
import "./data/language-transfer-data.js";

/**
 * Configures the API client and page-data cache, and registers the loaders.
 */
export function registerAll(): void {
  configureApi({ clientId, clientSecret, apiKey });
  configurePageData({
    defaultTtlMs: 300_000,
    perPatternTtl: { "/language-transfer": 30_000 },
  });
}
