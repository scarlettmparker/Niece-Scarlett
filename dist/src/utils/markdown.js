/**
 * Construct a link with Discord's markdown.
 *
 * @param text Text to add link.
 * @param url Where are we going?
 */
export const link = (text, url) => `[${text}](${url})`;
/**
 * Make text bold.
 *
 * @param text Text to make bold.
 */
export const bold = (text) => `**${text}**`;
/**
 * Make text italic.
 *
 * @param text Text to make italic.
 */
export const italic = (text) => `*${text}*`;
/**
 * Add a bullet point to a line.
 *
 * @param text Text to add a bullet point to.
 */
export const bullet = (text) => `- ${text}`;
