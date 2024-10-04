import { Client, Collection, CommandInteraction } from "@discord.js"
import { SlashCommandBuilder } from "@discord.js/builders";
export type CommandType = {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}
export type ClientType = Client & Partial<{commands: Collection<string, CommandType>}>;