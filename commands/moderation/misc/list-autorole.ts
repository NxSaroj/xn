import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } from 'discord.js'
  import autoroleConfig from '../../../models/misc/autoroleConfig'
import type{ SlashCommandProps } from 'commandkit'

  export const data =  new SlashCommandBuilder()
  .setName("list-autorole")
  .setDescription("list a auto-role for guild")
  .setDMPermission(false)

export async function run ({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  await interaction.deferReply({ ephemeral: true });
  
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.editReply({
          content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
      })
  }


  const isAutoRoleConfigured = await autoroleConfig.findOne({
    guildId: interaction.guild.id,
  });

  if (!isAutoRoleConfigured) {
    return await interaction.editReply({
        content: 'Autorole has not been configured for the server',
    })
  }
  const roleId = isAutoRoleConfigured.roleId
  if (!roleId) {
    return await interaction.editReply({
        content: 'Autorole has not been configured for the server',
    })
  }
  try {
    const { guild } = interaction;
      const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() || '' })
      .setColor('White')
      .setDescription(`> **Autorole** <:xn_arrow:1206238725130952755> <@&${roleId}> `)

      await interaction.editReply({
        embeds: [embed]
      })
  } catch (e) {        
      console.error(`Error in ${__filename} \n ${e}`)
      return await interaction.editReply({
          content: 'Error while setting up autorole, try again later',
      })
  }
}