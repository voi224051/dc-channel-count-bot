import { Client, Events, version as DiscordJSVer } from "@discord.js";
import { ClientType } from "./types/customdiscord.ts";
import { GatewayIntentBits } from '@discord_api_types';
import RegisterCommands from "./src/commands/commands.ts";
import Env from "./src/env.ts";

console.log(`@discord.js running on version ${DiscordJSVer}`)

// Setup

const configs = {
    intents: [
        GatewayIntentBits.Guilds
    ]
};

const client: ClientType = new Client(configs);

// Events

client.once(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Commands

RegisterCommands(client);

// Connect to actual discord

client.login(Env.getBotToken());