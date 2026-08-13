import { getPageData } from "@sun/ssr";
/**
 * Resolves page data, awaiting the underlying fetch.
 *
 * getPageData throws the pending promise while a loader runs; this waits for
 * it and returns the resolved slice.
 *
 * @param key the data key the loader returns
 * @param pattern the loader pattern
 * @param params the loader parameters
 * @return the resolved data slice
 */
export async function resolvePageData(key, pattern, params) {
    for (;;) {
        try {
            return getPageData(key, pattern, params).data;
        }
        catch (error) {
            if (error instanceof Promise) {
                await error;
                continue;
            }
            throw error;
        }
    }
}
