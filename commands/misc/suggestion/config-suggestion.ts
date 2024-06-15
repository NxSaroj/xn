import { EmbedBuilder, ComponentType, ColorResolvable }from 'discord.js'
import guildConfig from '../../../models/misc/guildConfig'
import { suggestionRow } from '../../../utilities/buttons/suggestion-row'
import { emojis } from '../../../utilities/json/config.json'
import type { CommandData, SlashCommandProps } from 'commandkit';

export const data:CommandData = {
  name: "config-suggestion",
  description: "Customize the suggestion module for the guild",
  dm_permission: false
}

export async function run({ interaction }:SlashCommandProps) {
  if (!interaction.inCachedGuild()) return
  try {
    if (!interaction.memberPermissions.has("Administrator")) {
      return await interaction.reply({
        content: "You need `Adminstrator` permission to execute this command",
      });
    }

    const isSuggestionConfigured = await guildConfig.findOne({
      guildId: interaction.guild.id,
    });

    let suggestionStatus = emojis.xn_wrong;

    if (isSuggestionConfigured) suggestionStatus = emojis.xn_tick;
    
    

    const response = await interaction.reply({
      embeds: [{
        title: 'Customize Embed Module', 
        thumbnail: interaction.guild.iconURL(),
        color: 0xff000 as ColorResolvable,
        fields: [
          {
            name: "Enabled",
            value: suggestionStatus,
          },
          {
            name: "Suggestion Channel",
            value:
              interaction.guild.channels.cache.get(
                isSuggestionConfigured?.channelId
              ) || "`Not set`",
          },
          {
            name: "Suggestion Role",
            value: isSuggestionConfigured?.roleId || "`Not set`",
          }
        ]
      }],
      components: [suggestionRow],
    });

    const collector = response.createMessageComponentCollector({
      time: 60_000,
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id == interaction.user.id,
    });
    collector.on("collect", async (i) => {
      switch (i.values[0]) {
        case "suggestion-role":
          await i.deferReply({ ephemeral: true });
          await i.editReply(`Enter the role **Id** in chat`);
          const messageCollector = interaction.channel?.createMessageCollector(
            {
              time: 60_00,
              filter: (message) => message.author.id == i.user.id,
            }
          );
          messageCollector?.on("collect", async (message) => {
            const roleId = message.content;
            const role = interaction.guild.roles.cache.get(roleId);
            if (!role) {
              return await i.followUp({
                content: "Invalid role Id, Try again",
                ephemeral: true,
              });
            }
            await isSuggestionConfigured?.updateMany({
              guildId: interaction.guild.id,
              roleId: roleId,
            });
            await isSuggestionConfigured?.save().catch(async (err) => {
              console.error(err);
              await i.followUp({
                content: "DB Error, Try Again Later",
                ephemeral: true,
              });
              return;
            });
            await i.followUp({
              content: `${role} Has configured as suggestion role, YaY`,
              ephemeral: true,
            });
          });
          break;
        case "suggestion-channel":
          await i.deferReply({ ephemeral: true });
          const configExist = await guildConfig.findOne({
            guildId: interaction.guildId,
          });
          if (configExist) {
            await guildConfig.deleteMany({ guildId: interaction.guild.id });
            await i.editReply(`Disabled The Suggestion System`);
          } else {
            await i.followUp({
              content: "Enter the channel **Id** in chat",
              ephemeral: true,
            });
            const collector = interaction.channel?.createMessageCollector({
              time: 60_000,
              filter: (message) => message.author.id == i.user.id,
            });
            collector?.on("collect", async (message) => {
              const channelId = message.content;
              collector.stop();
              const cachedChannel =
                interaction.guild.channels.cache.get(channelId);
              if (!cachedChannel)
                return await i.followUp({
                  content: "Enter a valid channel Id",
                  ephemeral: true,
                });
              await guildConfig.create({
                guildId: interaction.guild.id,
                channelId: channelId,
              });
              await i.followUp({
                content: `Added ${cachedChannel} As suggestion channel`,
                ephemeral: true,
              });
            });
          }
          break;
      }
    });
  } catch (error) {
    console.error(`Error in ${__dirname} \n ${error}`);
    return;
  }
}