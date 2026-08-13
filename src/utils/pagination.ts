export const MAX_PAGE_LENGTH = 3500;

/**
 * Splits long text into pages, breaking at the last newline that fits.
 *
 * @param content the text to split
 * @param maxLength the target page length
 * @return the pages, non-empty when content is non-empty
 */
export function chunkText(
  content: string,
  maxLength: number = MAX_PAGE_LENGTH
): string[] {
  const pages: string[] = [];
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

export interface PageSlice<T> {
  /**
   * The items on the requested page.
   */
  items: T[];
  /**
   * The zero-based page number.
   */
  page: number;
  /**
   * The total number of pages, at least one.
   */
  totalPages: number;
  /**
   * Whether a later page exists.
   */
  hasNext: boolean;
  /**
   * Whether an earlier page exists.
   */
  hasPrevious: boolean;
}

/**
 * Slices a list for the given page.
 *
 * @param items the full list
 * @param page the zero-based page number
 * @param size the page size
 */
export function pageSlice<T>(items: T[], page: number, size: number): PageSlice<T> {
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
