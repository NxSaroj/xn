"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('suggestion-channel')
    .setDescription('Add a suggestion channel')
    .addChannelOption((option) => option.setName('channel').setDescription('Channel for the accepting suggestion').addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement).setRequired(true))
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
    const isSuggestionConfigured = await guildConfig_1.default.exists({
        guildId: interaction.guild.id
    });
    if (isSuggestionConfigured) {
        await interaction.reply({
            content: "Suggestion's has already been configured in this server \n You can manage them using `/config-suggestion`",
            ephemeral: true
        });
        return;
    }
    const channel = interaction.options.getChannel('channel');
    try {
        const suggestionCongiguredEmbed = new discord_js_1.EmbedBuilder()
            .setDescription(`<:xn_tick:1209742516832706642> ${channel} Has been configured as suggestion channel`)
            .setColor('White');
        await guildConfig_1.default.create({
            guildId: interaction.guild.id,
            channelId: channel?.id
        }).then(async () => {
            await interaction.reply({
                embeds: [suggestionCongiguredEmbed]
            });
        }).catch(async (e) => {
            console.error(e);
            await interaction.reply({
                content: "DB Error, Try again later",
                ephemeral: true
            });
            return;
        });
    }
    catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        return;
    }
}
