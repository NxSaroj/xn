"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const autoroleConfig_1 = __importDefault(require("../../../models/misc/autoroleConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("add-autorole")
    .setDescription("add a auto-role for guild")
    .addRoleOption((option) => option
    .setName("role")
    .setDescription("the target role for autorole")
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    await interaction.deferReply({ ephemeral: true });
    const role = interaction.options.getRole("role");
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
        });
    }
    const botRolePosition = interaction.guild?.members?.me?.roles.highest.position;
    const targetRolePosition = role?.position;
    if (!botRolePosition)
        return;
    if (!targetRolePosition)
        return;
    if (targetRolePosition >= botRolePosition) {
        return await interaction.editReply({
            content: "I can't moderate that role",
        });
    }
    const isAutoRoleConfigured = await autoroleConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    try {
        if (isAutoRoleConfigured) {
            return await interaction.editReply({
                content: 'Auto-role for this server has already been configured run `/remove-autorole` to remove the autorole',
            });
        }
        else {
            await autoroleConfig_1.default.create({
                roleId: role?.id,
                guildId: interaction.guild.id,
            }).then(async () => {
                const embed = new discord_js_1.EmbedBuilder()
                    .setDescription(`> ${role} will be assigned upon joinning`)
                    .setColor('White')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 }) || '' });
                return await interaction.editReply({
                    embeds: [embed],
                });
            });
        }
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
        return await interaction.editReply({
            content: 'Error while setting up autorole, try again later',
        });
    }
}
exports.run = run;
