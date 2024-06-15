"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const logsConfig_1 = __importDefault(require("../../../models/moderation/logs/logsConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("add-log-channel")
    .setDescription("Add a channel for logging")
    .addChannelOption((option) => option
    .setName("channel")
    .setDescription("The channel for logging")
    .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement)
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const channel = interaction.options.getChannel("channel");
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({
            content: "**Required permissions** <:xn_arrow:1206238725130952755> `Administrator`",
            ephemeral: true,
        });
    }
    await interaction.deferReply();
    const guildConfigration = await logsConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    const isChannelConfigured = await logsConfig_1.default.findOne({
        channelId: channel?.id,
    });
    try {
        if (guildConfigration) {
            return await interaction.editReply({
                content: "Logs configration has already been setup in the guild, \n Run `/remove-log-channel` to disable log channel",
            });
        }
        else if (isChannelConfigured) {
            return await interaction.editReply({
                content: `${channel} Is already been setup-as logs channel`,
            });
        }
        else {
            try {
                await logsConfig_1.default
                    .create({
                    channelId: channel?.id,
                    guildId: interaction.guild.id,
                })
                    .then(async () => {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **Logs Channel Added** <:xn_arrow:1206238725130952755> ${channel}`)
                        .setColor("White");
                    await interaction.editReply({
                        embeds: [embed],
                    });
                    return;
                });
            }
            catch (err) {
                console.error(__filename, err);
            }
        }
    }
    catch (err) {
        console.error(__filename, err);
    }
}
exports.run = run;
