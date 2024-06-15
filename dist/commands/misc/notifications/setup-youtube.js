"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = exports.run = void 0;
const discord_js_1 = require("discord.js");
const youtubeConfig_1 = __importDefault(require("../../../models/premium/youtubeConfig"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const parser = new rss_parser_1.default();
/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
        });
    }
    const isYoutubeConfigured = await youtubeConfig_1.default
        .exists({
        guildId: interaction.guild.id,
    })
        .catch((err) => {
        return console.error(`Error in ${__filename} \n ${err}`);
    });
    if (isYoutubeConfigured) {
        return await interaction.reply({
            content: "1 Youtube channel is already configure in the guild \n Try out premium for more youtube channels",
            ephemeral: true,
        });
    }
    const channelId = interaction.options.getString("channel-id");
    const customMessage = interaction.options.getString("custom-message") ||
        "{channel} Has just uploaded a video, Checkout AT [Here]({link})";
    const channel = interaction.options.getChannel("channel");
    const youtube_url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const ytFeed = await parser.parseURL(youtube_url).catch(async (err) => {
        await interaction.reply({
            content: "The youtube channel id you provided is incorrect",
            ephemeral: true,
        });
        return;
    });
    if (!ytFeed)
        return;
    const channelName = ytFeed.title;
    const YoutubeConfig = new youtubeConfig_1.default({
        guildId: interaction.guild.id,
        channelId: channelId,
        messageChannel: channel?.id,
        customMessage: customMessage,
        lastUpdated: new Date(),
        lastUpdatedVideo: null,
    });
    if (ytFeed.items.length) {
        const latestVideo = ytFeed.items[0];
        YoutubeConfig.lastUpdatedVideo = {
            id: latestVideo.id.split(":")[2],
            pubDate: latestVideo.pubDate,
        };
    }
    YoutubeConfig.save()
        .then(async () => {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:xn_tick:1209742516832706642> **Youtube channel added**`)
            .addFields({ name: 'Name', value: `${channelName}` }, { name: 'Channel', value: `${channel}` });
        await interaction.reply({
            embeds: [embed],
        });
    })
        .catch(async (err) => {
        console.error(err);
        return;
    });
}
exports.run = run;
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("setup-youtube")
    .setDescription("Configure your guild for youtube notification")
    .addStringOption((option) => option
    .setName("channel-id")
    .setDescription("The id of your youtube channel")
    .setRequired(true))
    .addChannelOption((option) => option
    .setName("channel")
    .setDescription("The channel for notification")
    .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement)
    .setRequired(true))
    .addStringOption((option) => option
    .setName("custom-message")
    .setDescription("Message that will sent on every new upload")
    .setRequired(false))
    .setDMPermission(false);
