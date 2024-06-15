"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('list-suggestion-channel')
    .setDescription('List all the suggestion channels')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
            content: "You need `Manage Channel(s)` permissions to execute this command",
            ephemeral: true
        });
    }
    const isSuggestionConfigured = await guildConfig_1.default.findOne({
        guildId: interaction.guild.id
    });
    if (!isSuggestionConfigured) {
        return await interaction.reply({
            content: "I can't list suggestion channels, as they have not been congigured",
            ephemeral: true
        });
    }
    const suggestionChannel = isSuggestionConfigured.channelId;
    try {
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`<:xn_tick:1209742516832706642> **Suggestion Channel** <:xn_arrow:1207610123778920448> <#${suggestionChannel}>`)
            .setColor('White');
        await interaction.reply({
            embeds: [embed]
        });
    }
    catch (err) {
        await interaction.reply({
            content: "Error camed, Try again later",
            ephemeral: true
        });
        console.error(`Error in ${__filename} \n ${err}`);
        return;
    }
}
exports.run = run;
