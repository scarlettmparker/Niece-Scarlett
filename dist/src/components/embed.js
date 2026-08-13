/**
 * Embedded Discord message builder.
 */
export class EmbedMessage {
    title = "";
    body = "";
    footer = "";
    /**
     * Set the title.
     */
    setTitle(title) {
        this.title = title;
        return this;
    }
    /**
     * Set the body.
     */
    setBody(body) {
        this.body = body;
        return this;
    }
    /**
     * Set the footer.
     */
    setFooter(footer) {
        this.footer = footer;
        return this;
    }
    /**
     * Add a new line.
     */
    addLine(line) {
        this.body += line + "\n";
        return this;
    }
    /**
     * Build the damn thing.
     */
    build() {
        return {
            title: this.title,
            description: this.body,
            footer: { text: this.footer },
        };
    }
}
