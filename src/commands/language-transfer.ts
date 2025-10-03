import { loadTranslations } from "~/translations";
import { Command } from "~/types/command";
import { sendable } from "~/utils/sendable";

const command: Command = {
  name: "lt",
  aliases: ["language-transfer"],
  description: "Replies with a hello world message",
  async execute(message) {
    const t = loadTranslations("hello-world", "el");

    const channel = message.channel;
    if (sendable(channel)) {
      await channel.send(t("message"));
    }
  },
};

export default command;
