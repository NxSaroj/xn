"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const autoroleConfig_1 = __importDefault(require("../../../models/misc/autoroleConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("remove-autorole")
    .setDescription("remove a auto-role for guild")
    .addRoleOption((option) => option
    .setName("role")
    .setDescription("the target role for autorole")
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    await interaction.deferReply();
    const role = interaction.options.getRole('role');
    const isAlreadyDisabled = await autoroleConfig_1.default.findOne({ roleId: role?.id, guildId: interaction.guild.id });
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
        });
    }
    try {
        if (!isAlreadyDisabled) {
            return await interaction.editReply({
                content: 'That role has not been configured for autorole',
            });
        }
        else {
            await autoroleConfig_1.default.findOneAndDelete({
                roleId: role?.id,
                guildId: interaction.guild.id
            }).then(async () => {
                const embed = new discord_js_1.EmbedBuilder()
                    .setDescription(`> ${role} Has been removed from autorole`)
                    .setColor('White');
                return await interaction.editReply({
                    embeds: [embed]
                });
            }).catch(async (e) => {
                console.error(e);
                return await interaction.editReply({
                    content: 'DB error, try again later',
                });
            });
        }
    }
    catch (err) {
        await interaction.deferReply({ ephemeral: true });
        console.error(__filename, err);
        return await interaction.editReply({
            content: 'Error while removing that role from autorole',
        });
    }
}
exports.run = run;
