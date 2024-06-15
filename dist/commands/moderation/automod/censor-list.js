"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('censor-list')
    .setDescription('List all the censor words of the guild')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You need to have `Moderate Member(s)` permissions to execute this command',
            ephemeral: true
        });
    }
    const isCensorSetup = await censorConfig_1.default.findOne({
        guildId: interaction.guild.id
    });
    if (!isCensorSetup) {
        await interaction.reply({
            content: `The censor system has not been configured for the server`,
            ephemeral: true,
        });
        return;
    }
    const censorWords = isCensorSetup.censorWords;
    if (censorWords.length === 0) {
        console.log(censorWords);
        return await interaction.reply({
            content: 'Error camed',
            ephemeral: true
        });
    }
    try {
        const censorListEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`**Censor Words Fetched**`)
            .setDescription(censorWords.join('\n').toString())
            .setColor('White');
        await interaction.reply({
            embeds: [censorListEmbed]
        });
    }
    catch (e) {
        console.log(e);
        console.error(`Error in file ${__filename} \n ${e}`);
        return;
    }
}
exports.run = run;
