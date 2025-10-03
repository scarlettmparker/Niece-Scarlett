import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // dpp default intents
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // dpp i_message_content
    GatewayIntentBits.GuildMembers, // dpp i_guild_member
  ],
});

client.on("clientReady", (c) => {
  console.log(`${c.user.username} is online.`);
});

client.login(process.env.BOT_TOKEN);
