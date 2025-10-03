import { Client, Collection } from "discord.js";
import { Command } from "./command";

export interface ClientType extends Client {
  commands: Collection<string, Command>;
}
