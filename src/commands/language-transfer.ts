import { EmbedMessage } from "~/components/embed";
import { loadTranslations } from "~/translations";
import { Command } from "~/types/command";
import { bullet, link } from "~/utils/markdown";
import { sendable } from "~/utils/sendable";

const YOUTUBE_LINK =
  "https://www.youtube.com/watch?v=dHsgJkV9J30&list=PLeA5t3dWTWvtWkl4oOV8J9SMB7L9N9Ogt";
const SOUNDCLOUD_LINK =
  "https://soundcloud.com/languagetransfer/sets/complete-greek-more-audios";
const TRANSCRIPT_LINK =
  "https://static1.squarespace.com/static/5c69bfa4f4e531370e74fa44/t/5d03d32873f6f10001a364b5/1560531782855/COMPLETE+GREEK+-+Transcripts_LT.pdf";
const RESOURCES_LINK =
  "https://discord.com/channels/350234668680871946/359578025228107776/1132288734738522112";

/**
 * Explain language transfer.
 */
const command: Command = {
  name: "lt",
  aliases: [
    "what is lt",
    "language transfer",
    "what is language transfer",
    "explain lt",
    "explain language transfer",
  ],
  description: "Explain language transfer",
  async execute(message) {
    const t = loadTranslations("language-transfer", "en");
    const channel = message.channel;

    if (!sendable(channel)) return;

    // Construct the message body
    const body =
      t("message.body.intro") +
      "\n\n" +
      t("message.body.bullets-header") +
      "\n\n" +
      bullet(link(t("message.body.bullets.youtube"), YOUTUBE_LINK)) +
      "\n" +
      bullet(link(t("message.body.bullets.soundcloud"), SOUNDCLOUD_LINK)) +
      "\n" +
      bullet(link(t("message.body.bullets.transcript"), TRANSCRIPT_LINK)) +
      "\n\n" +
      t("message.body.outro.blurb") +
      "\n\n" +
      t("message.body.outro.resources") +
      " " +
      link(t("message.body.outro.resources-link"), RESOURCES_LINK) +
      t("message.body.outro.resources-continued");

    const embed = new EmbedMessage()
      .setTitle(t("message.title"))
      .setBody(body)
      .setFooter(t("message.footer"))
      .build();

    await channel.send({ embeds: [embed] });
  },
};

export default command;
