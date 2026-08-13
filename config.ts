/**
 * @fileoverview Configuration settings for the bot, loaded from environment variables.
 * @module config
 */
import { config } from "dotenv";

config();

export const botToken = process.env.BOT_TOKEN || "";
export const guildId = process.env.DISCORD_GUILD_ID || "";
export const graphqlEndpoint =
  process.env.GRAPHQL_ENDPOINT || "http://localhost:8083/graphql";
export const clientId = process.env.CLIENT_ID || "niece-scarlett";
export const clientSecret = process.env.CLIENT_SECRET || "";
export const apiKey = process.env.NS_API_KEY || "";
export const host = process.env.SERVER_HOST || "0.0.0.0";
export const port = parseInt(process.env.SERVER_PORT || "3000", 10);
