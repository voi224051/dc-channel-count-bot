import { CategoryChannel, CommandInteraction, TextChannel } from "@discord.js"
import { SlashCommandBuilder } from "@discord.js/builders"

const execute = async (interaction: CommandInteraction) => {
    if (interaction.guild) {
        const CategoryCount: {[key: string]: number} = {};
        const CategoryDict: {[key: string]: string} = {};

        await interaction.guild.channels.fetch()
        .then(allChannels => allChannels.forEach((chnl: CategoryChannel | TextChannel | null) => {
            if (chnl !== null) {
                if (chnl.type == 4) {
                    CategoryDict[chnl.name] = chnl.id;
                }
                if (chnl.type == 0) {
                    if (CategoryCount[chnl.parentId] === undefined) CategoryCount[chnl.parentId] = 0;
                    CategoryCount[chnl.parentId] += 1;
                }
            }
        }));
        
        // for (const [name, id] of Object.entries(CategoryDict)) {
        //     console.log(name, "- ", CategoryCount[id]);
        // }
        const ReplyString = [
            "## Channel Counts:",
            `- Active - ${CategoryCount[CategoryDict['active']]}`,
            `- Shelve - ${CategoryCount[CategoryDict['shelve']]}`,
            `- Halt - ${CategoryCount[CategoryDict['halt']]}`,
            `- Plans - ${CategoryCount[CategoryDict['plans']]}`
        ].join('\n')
        await interaction.reply(ReplyString);
    }
    else await interaction.reply("Pong!");
}

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Asking me if I am alive'),
    execute
};