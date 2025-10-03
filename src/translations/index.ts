import * as fs from "fs";
import * as path from "path";

type Translations = Record<string, unknown>;

// in-memory cache for translations
const cache: Record<string, Translations> = {};

/**
 * Get deep nested value from an object by a dot path. i18n style.
 *
 * @param obj Object to traverse.
 * @param keyPath Key to find.
 */
// i am NOT typing every translation file json
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, keyPath: string): string | undefined {
  return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * Load a translation file.
 */
export function loadTranslations(
  namespaces: string | string[],
  language: string = "en"
) {
  // namespace array
  const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
  const loaded: Record<string, Translations> = {};

  for (const ns of nsArray) {
    const cacheKey = `${ns}.${language}`;
    if (!cache[cacheKey]) {
      // build path, e.g. languages/command/en.json
      const filePath = path.resolve(
        "languages",
        ...ns.split("."),
        `${language}.json`
      );

      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing translation file: ${filePath}`);
      }

      // get file content
      const fileContent = fs.readFileSync(filePath, "utf-8");
      cache[cacheKey] = JSON.parse(fileContent);
    }

    loaded[ns] = cache[cacheKey];
  }

  return function t(key: string): string {
    for (const ns of nsArray) {
      const value = getNestedValue(loaded[ns], key);
      if (value !== undefined) return value;
    }
    return key; // fallback to key if not found
  };
}
