import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  APIEmbed,
  ChannelType,
} from "discord.js";
import { emojis } from "../../utilities/json/config.json";
import { logsConfigRow } from "../../utilities/select-menu/logConfigMenu";
import logsConfig from "../../models/moderation/logs/logsConfig";

export const data = new SlashCommandBuilder()
  .setName("logs-config")
  .setDescription("Check the log configration of the guild")
  .setDMPermission(false);

export async function run({
  interaction,
}: import("commandkit").SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    return await interaction.reply({
      content:
        "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
      ephemeral: true,
    });
  }

  const guildConfig = await logsConfig.findOne({
    guildId: interaction.guild.id,
  });

  try {
    const embed: APIEmbed = {
      color: 0xffffff,
      author: {
        name: `${interaction.guild.name}`,
        icon_url: interaction.guild.iconURL() || "",
      },
      fields: [
        {
          name: `Message Logs`,
          value: `${
            guildConfig?.messageLog ? emojis.xn_tick : emojis.xn_wrong
          }`,
          inline: false,
        },
        {
          name: `Channel Logs`,
          value: `${
            guildConfig?.channelLog ? emojis.xn_tick : emojis.xn_wrong
          }`,
          inline: false,
        },
        {
          name: `Join Leave Logs`,
          value: `${
            guildConfig?.welcomeLog ? emojis.xn_tick : emojis.xn_wrong
          }`,
          inline: false,
        },
      ],
    };
    const response = await interaction.reply({
      embeds: [embed],
      components: [logsConfigRow],
    });
    const collector = response.createMessageComponentCollector({
      filter: (i) => i.user.id == interaction.user.id,
      time: 240_000,
      componentType: ComponentType.StringSelect,
    });
    collector.on("collect", async (i) => {
      switch (i.values[0]) {
        case "enable-logs":
          await i.deferReply({ ephemeral: true });
          const isLogsEnabled = await logsConfig.exists({
            guildId: interaction.guild.id,
          });
          if (isLogsEnabled) {
            return logsConfig
              .deleteMany({ guildId: interaction.guildId })
              .then(() => {
                i.editReply({ content: "Disabled The Module" });
              })
              .catch((err) => {
                console.error(err);
                i.editReply({ content: "DB Error, Try again later" });
                return;
              });
          }
          const channel = await interaction.guild.channels
            .create({
              name: "xantrack-logs",
              type: ChannelType.GuildText,
              permissionOverwrites: [
                {
                  id: interaction.guildId,
                  deny: ["ViewChannel"],
                },
              ],
            })
            .catch(() => {
              return i.reply({
                content: "I dont have permission to create a channel",
                ephemeral: true,
              });
            });
          logsConfig
            .create({
              channelId: channel.id,
              guildId: interaction.guildId,
              messageLog: true,
              channelLog: true,
              modLog: true,
              welcomeLog: true,
            })
            .then(() => {
              i.editReply({
                content: `Logs has been enabled and can be accessed in ${channel}`,
              });
            })
            .catch((err) => {
              console.error(err);
              i.editReply({ content: "DB Error, Try again later" });
              return;
            });
          break;

        case "messageLog":
          await i.deferReply({ ephemeral: true });
          const isMLogEnabled = await logsConfig.findOne({
            guildId: interaction.guild.id,
          });
          if (!isMLogEnabled)
            return await i.editReply({
              content: "The log module is not enabled",
            });
          if (isMLogEnabled.messageLog == true) {
            logsConfig
              .findOneAndUpdate(
                { guildId: interaction.guildId },
                { messageLog: false }
              )
              .then(() => {
                i.editReply({
                  content: "Message will not be logged from now on",
                });
              })
              .catch((err) => {
                console.error(err);
                i.editReply({ content: "DB Error, Try again later" });
                return;
              });
          } else {
            logsConfig
              .findOneAndUpdate(
                { guildId: interaction.guildId },
                { messageLog: true }
              )
              .then(() => {
                i.editReply({ content: "Message will  be logged from now on" });
              })
              .catch((err) => {
                console.error(err);
                i.editReply({ content: "DB Error, Try again later" });
                return;
              });
          }
          break;
      }
    });
  } catch (err) {
    console.log(`Error in ${__filename} \n ${err}`);
    return await interaction.reply({
      content:
        "Logs has not been configured for this server \n Run `/add-log-channel` to add a log channel",
      ephemeral: true,
    });
  }
}
