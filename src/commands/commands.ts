import { Collection, Events } from "@discord.js";
import { REST } from "@discord.js/rest"
import { ClientType, CommandType } from "@discord_custom";
import { RESTGetAPIApplicationCommandsResult } from "@discord_api_types";
import Env from "../env.ts";
import { Routes } from "@discord_api_types";

const commands: CommandType[] = [];

const foldersPath = './src/commands';
const commandFolders = Deno.readDirSync(foldersPath);
for (const folder of commandFolders) {
    if (folder.isFile) continue;
    const folderPath = `${foldersPath}/${folder.name}`;
    const folderContent = Deno.readDirSync(folderPath);
    for (const cmdFile of folderContent) {
        const commandsPath = `./${folder.name}/${cmdFile.name}`;
        const command: CommandType = await import(commandsPath).then(obj=>obj.default);
        commands.push(command);
    }
}

const RegisterCommands = (client: ClientType) => {
    client.commands = new Collection();
    commands.forEach(cmd => client.commands.set(cmd.data.name, cmd));

    const rest = new REST().setToken(Env.getBotToken());

    (async () => {
        try {
            console.log(`==== Refreshing ${commands.length} application (/) commands... ====`)
            const data = await rest.put(
                Routes.applicationCommands(Env.getClientID()),
                { body: commands.map(cmd=>cmd.data.toJSON()) }
            ) as RESTGetAPIApplicationCommandsResult;
            console.log(data.map(cmd=>cmd.name))
            console.log(`==== Successfully reloaded ${data!.length} application (/) commands! ====`);
        }
        catch (err) {
            console.error(err);
        }
    })()

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const cli = (interaction.client as ClientType)
        if (!cli.commands) {
            console.error("No commands recorded in client object!");
            return;
        }
        const command = cli.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found!`);
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
            else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }
    });
}

export default RegisterCommands;