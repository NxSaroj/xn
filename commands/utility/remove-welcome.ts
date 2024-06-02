import {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  ApplicationCommandOptionType,
} from 'discord.js'
import welcomeConfig from '../../models/welcome/welcomeConfig'
import type { CommandData, SlashCommandProps } from 'commandkit'
export const data:CommandData = {
  name: 'remove-welcome-channel', 
  description: 'remove the configured welcome channel', 
  options: [
    { name: 'channel', description: 'the channel to remove', type: ApplicationCommandOptionType.Channel, channel_types: [ChannelType.GuildText],  required: true }
  ],
  dm_permission: false
}


export async function run ({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {
    return await interaction.reply({
      content: "You need `Administrator` permissions to execute this command",
      ephemeral: true,
    });
  }

  const channel = interaction.options.getChannel("channel");
  const isChannelConfigured = await welcomeConfig.findOne({
    channelId: channel?.id,
  });
  const isGuildConfigured = await welcomeConfig.findOne({
    guildId: interaction.guild.id,
  });
  const messageContent = isGuildConfigured?.messageContent
  const customMessage = isGuildConfigured?.customMessage

  if (!messageContent) return;
  if (!customMessage) return
  if (!isGuildConfigured) {
    return await interaction.reply({
      content: `Welcome channel has not been configured in this channel`,
      ephemeral: true,
    });
  }
  if (!isChannelConfigured) {
    return await interaction.reply({
      content: `${channel} is not configured for welcome messages`,
      ephemeral: true,
    });
  } else {
    await welcomeConfig
      .findOneAndDelete({
        channelId: channel?.id,
        guildId: interaction.guild.id,
        messageContent: messageContent,
        customMessage: customMessage
      })
      .then(async () => {
        return await interaction.reply({
          content: `${channel} Has been removed for welcome message`,
          ephemeral: true,
        });
      });
  }
}