export const MAX_PAGE_LENGTH = 3500;
/**
 * Splits long text into pages, breaking at the last newline that fits.
 *
 * @param content the text to split
 * @param maxLength the target page length
 * @return the pages, non-empty when content is non-empty
 */
export function chunkText(content, maxLength = MAX_PAGE_LENGTH) {
    const pages = [];
    let remaining = content;
    while (remaining.length > maxLength) {
        let cut = remaining.lastIndexOf("\n", maxLength);
        if (cut <= 0) {
            cut = remaining.lastIndexOf(" ", maxLength);
        }
        if (cut <= 0) {
            cut = maxLength;
        }
        pages.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
    }
    if (remaining.length > 0) {
        pages.push(remaining);
    }
    return pages;
}
/**
 * Slices a list for the given page.
 *
 * @param items the full list
 * @param page the zero-based page number
 * @param size the page size
 */
export function pageSlice(items, page, size) {
    const totalPages = Math.max(Math.ceil(items.length / size), 1);
    const start = page * size;
    const slice = items.slice(start, start + size);
    return {
        items: slice,
        page,
        totalPages,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
    };
}
