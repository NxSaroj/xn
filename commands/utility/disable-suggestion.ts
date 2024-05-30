import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} from 'discord.js'
import guildConfig from '../../models/misc/guildConfig'
import { SlashCommandProps } from 'commandkit'
export const data:SlashCommandBuilder = new SlashCommandBuilder()
.setName("disable-suggestion")
.setDescription("Disable the suggestion settings for the guild")
.setDMPermission(false)

async function run ({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.ManageChannels
    )
  ) {
    return await interaction.reply({
      content:
        "You need `Manage Channel(s)` permissions to execute this command",
      ephemeral: true,
    });
  }

  const isSuggestionEnabled = await guildConfig.exists({
    guildId: interaction.guild.id,
  });

  if (!isSuggestionEnabled) {
    return await interaction.reply({
      content:
        "You can't disable suggestion in this server, as it has not been configured",
      ephemeral: true,
    });
  }

  try {
    await guildConfig
      .deleteMany({
        guildId: interaction.guild.id,
      })
      .then(async () => {
        await interaction.reply({
          content: "Disabled the suggestion system for the server",
        });
      })
      .catch(async (e) => {
        console.error(e);
        await interaction.reply({
          content: "Error while disabling suggestion, Try again later",
          ephemeral: true,
        });
        return;
      });
  } catch (err) {
    console.error(`Error in ${__filename} \n ${err}`);
    await interaction.reply({
      content: "Error while disabling suggestion, Try again later",
      ephemeral: true,
    });
    return;
  }
}