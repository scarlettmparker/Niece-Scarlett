import { APIEmbed } from "discord.js";

/**
 * Embedded Discord message builder.
 */
export class EmbedMessage {
  private title: string = "";
  private body: string = "";
  private footer: string = "";

  /**
   * Set the title.
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * Set the body.
   */
  setBody(body: string) {
    this.body = body;
    return this;
  }

  /**
   * Set the footer.
   */
  setFooter(footer: string) {
    this.footer = footer;
    return this;
  }

  /**
   * Add a new line.
   */
  addLine(line: string) {
    this.body += line + "\n";
    return this;
  }

  /**
   * Build the damn thing.
   */
  build(): APIEmbed {
    return {
      title: this.title,
      description: this.body,
      footer: { text: this.footer },
    };
  }
}
