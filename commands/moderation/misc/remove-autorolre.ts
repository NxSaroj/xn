import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } from 'discord.js'
  import autoroleConfig from '../../../models/misc/autoroleConfig'
import { SlashCommandProps } from 'commandkit'

export const data = new SlashCommandBuilder()
.setName("remove-autorole")
.setDescription("remove a auto-role for guild")
.addRoleOption((option) =>
  option
    .setName("role")
    .setDescription("the target role for autorole")
    .setRequired(true)
)
.setDMPermission(false)

export async function run({ interaction }:SlashCommandProps) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply();
    const role = interaction.options.getRole('role');
    const isAlreadyDisabled = await autoroleConfig.findOne({ roleId: role?.id, guildId: interaction.guild.id });

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
        });
    }

    try {
        if (!isAlreadyDisabled) {
            return await interaction.editReply({
                content: 'That role has not been configured for autorole',
            });
        } else {
            await autoroleConfig.findOneAndDelete({
                roleId: role?.id,
                guildId: interaction.guild.id
            }).then(async () => {
                const embed = new EmbedBuilder()
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
    } catch (err) {
        await interaction.deferReply({ ephemeral: true });
        console.error(__filename, err);
        return await interaction.editReply({
            content: 'Error while removing that role from autorole',
        });
    }
}