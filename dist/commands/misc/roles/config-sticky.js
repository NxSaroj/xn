"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const stickyConfig_1 = __importDefault(require("../../../models/premium/stickyConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('sticky-config')
    .setDescription('Enable or disable sticky role for the guild')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member?.permissions?.has(discord_js_1.PermissionsBitField.Flags.ManageGuild)) {
        await interaction.reply({
            content: 'Required permissions > `Adminstrator(s)`',
            ephemeral: true
        });
    }
    const enableEmbed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 }) || undefined })
        .setColor('White')
        .setDescription(`> **Enabled The Sticky Roles**`);
    const disableEmbed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 }) || undefined })
        .setColor('White')
        .setDescription(`> **Disabled The Sticky Roles**`);
    const isStickyConfigured = await stickyConfig_1.default.findOne({
        guildId: interaction.guild.id
    });
    if (isStickyConfigured) {
        stickyConfig_1.default.deleteMany({
            guildId: interaction.guild.id
        }).then(async () => {
            await interaction.reply({
                embeds: [disableEmbed]
            });
            return;
        }).catch(async (e) => {
            console.error(e);
            await interaction.reply({
                content: 'DB Error, try again later',
                ephemeral: true
            });
            return;
        });
    }
    else {
        stickyConfig_1.default.create({
            guildId: interaction.guild.id
        }).then(async () => {
            return await interaction.reply({
                embeds: [enableEmbed]
            });
        }).catch(async (e) => {
            console.error(e);
            await interaction.reply({
                content: 'DB Error, try again later',
                ephemeral: true
            });
        });
    }
}
exports.run = run;
