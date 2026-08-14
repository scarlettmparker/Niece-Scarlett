import { bullet, link } from "~/utils/markdown.js";

export interface LanguageTransferFaqBullet {
  /**
   * The link label.
   */
  label: string;
  /**
   * The link URL.
   */
  url: string;
}

export interface LanguageTransferFaq {
  /**
   * The embed title.
   */
  title?: string;
  /**
   * The opening paragraph.
   */
  intro?: string;
  /**
   * The heading above the bullet list.
   */
  bulletsHeader?: string;
  /**
   * The resource links.
   */
  bullets?: LanguageTransferFaqBullet[];
  /**
   * The link to a Discord resources channel.
   */
  resourcesChannel?: string;
  /**
   * The closing section.
   */
  outro?: {
    /**
     * The closing paragraph.
     */
    blurb?: string;
    /**
     * The text introducing the resources channel.
     */
    resources?: string;
    /**
     * The label for the resources channel link.
     */
    resourcesLink?: string;
    /**
     * The text following the resources channel link.
     */
    resourcesContinued?: string;
  };
  /**
   * The embed footer.
   */
  footer?: string;
}

/**
 * The render-ready FAQ content: title and a markdown body.
 */
export interface ResolvedFaq {
  /**
   * The embed title.
   */
  title: string;
  /**
   * The markdown body.
   */
  body: string;
  /**
   * The embed footer.
   */
  footer: string;
}

/**
 * A language-transfer property-set entry: either inline content or a blog lookup.
 */
export interface LanguageTransferEntry {
  /**
   * Whether the entry carries inline content or a blog reference.
   */
  kind: "content" | "blog";
  /**
   * The inline content, when kind is content.
   */
  content?: LanguageTransferFaq;
  /**
   * The blog post type to look up, when kind is blog.
   */
  typeName?: string;
  /**
   * The blog post language to narrow the lookup.
   */
  language?: string;
  /**
   * An exact briareus post reference, e.g. briareus:post:<id>.
   */
  remoteObject?: string;
}

/**
 * Renders structured FAQ values into a markdown body.
 *
 * @param faq the FAQ values
 * @return the markdown body
 */
export function buildFaqBody(faq: LanguageTransferFaq): string {
  const intro = faq.intro ?? "";
  const bulletsHeader = faq.bulletsHeader ? `\n\n${faq.bulletsHeader}` : "";
  const bullets = (faq.bullets ?? [])
    .map((item) => bullet(link(item.label, item.url)))
    .join("\n");
  const blurb = faq.outro?.blurb ? `\n\n${faq.outro.blurb}` : "";
  const resources =
    faq.outro?.resources && faq.resourcesChannel
      ? `\n\n${faq.outro.resources} ${link(
          faq.outro.resourcesLink ?? faq.outro.resources,
          faq.resourcesChannel
        )}${faq.outro.resourcesContinued ?? ""}`
      : "";
  return `${intro}${bulletsHeader}\n\n${bullets}${blurb}${resources}`;
}
