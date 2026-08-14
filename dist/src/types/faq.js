import { bullet, link } from "~/utils/markdown.js";
/**
 * Renders structured FAQ values into a markdown body.
 *
 * @param faq the FAQ values
 * @return the markdown body
 */
export function buildFaqBody(faq) {
    const intro = faq.intro ?? "";
    const bulletsHeader = faq.bulletsHeader ? `\n\n${faq.bulletsHeader}` : "";
    const bullets = (faq.bullets ?? [])
        .map((item) => bullet(link(item.label, item.url)))
        .join("\n");
    const blurb = faq.outro?.blurb ? `\n\n${faq.outro.blurb}` : "";
    const resources = faq.outro?.resources && faq.resourcesChannel
        ? `\n\n${faq.outro.resources} ${link(faq.outro.resourcesLink ?? faq.outro.resources, faq.resourcesChannel)}${faq.outro.resourcesContinued ?? ""}`
        : "";
    return `${intro}${bulletsHeader}\n\n${bullets}${blurb}${resources}`;
}
