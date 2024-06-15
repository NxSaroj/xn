"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const autoroleConfig_1 = __importDefault(require("../../../models/misc/autoroleConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("list-autorole")
    .setDescription("list a auto-role for guild")
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
        });
    }
    const isAutoRoleConfigured = await autoroleConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    if (!isAutoRoleConfigured) {
        return await interaction.editReply({
            content: 'Autorole has not been configured for the server',
        });
    }
    const roleId = isAutoRoleConfigured.roleId;
    if (!roleId) {
        return await interaction.editReply({
            content: 'Autorole has not been configured for the server',
        });
    }
    try {
        const { guild } = interaction;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || '' })
            .setColor('White')
            .setDescription(`> **Autorole** <:xn_arrow:1206238725130952755> <@&${roleId}> `);
        await interaction.editReply({
            embeds: [embed]
        });
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
        return await interaction.editReply({
            content: 'Error while setting up autorole, try again later',
        });
    }
}
exports.run = run;
