export const MAX_PAGE_LENGTH = 3500;

/**
 * Splits long text into pages, breaking at the last newline that fits.
 *
 * @param content the text to split
 * @param maxLength the target page length
 * @return the pages, non-empty when content is non-empty
 */
export function chunkText(content: string, maxLength: number = MAX_PAGE_LENGTH): string[] {
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
