import {
  EmbedBuilder,
  ComponentType,
  StringSelectMenuInteraction,
  Message,
} from "discord.js";
/** Importing Components */
import { censorWordRow } from "../../../utilities/select-menu/censorWordMenu";
import { antiLinksRow } from "../../../utilities/select-menu/antiLinkMenu";
import { row } from "../../../utilities/select-menu/autoModMenu";
import { emojis } from "../../../utilities/json/config.json";
import { linkPunishmentRow } from "../../../utilities/select-menu/linkPunishmentMenu";
import { censorPunishmentRow } from "../../../utilities/select-menu/censorPunishmentMenu";

/** Importing Schema */
import antiLinkConfig from "../../../models/moderation/automod/antiLinkConfig";
import censorConfig from "../../../models/moderation/automod/censorConfig";
import ignoreConfig from "../../../models/moderation/automod/ignoreConfig";

/**Importing Types */
import { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
export const data: CommandData = {
  name: "config-automod",
  description: "Moderate Your Server With Xantrack",
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  if (!interaction.guild) return;
  if (!interaction?.guild?.members?.me?.permissions.has("Administrator")) {
    return await interaction.reply({
      content: "I need `Administrator` permissions to execute this command",
    });
  }

  if (!interaction?.memberPermissions?.has("Administrator")) {
    return await interaction.reply({
      content: "You need `Adminstrator` permissions to execute this command",
      ephemeral: true,
    });
  }

  let linkFilterEnabled = "<:wrong:1211166597297733713>";
  let censorEnabled = "<:wrong:1211166597297733713>";

  const isLinkFilterEnabled = await antiLinkConfig.findOne({
    guildId: interaction.guild.id,
  });

  const isCensorEnabled = await censorConfig.findOne({
    guildId: interaction.guild.id,
  });

  if (isLinkFilterEnabled) {
    linkFilterEnabled = "<:xn_green_tick:1209070697939210302>";
  }

  if (isCensorEnabled) {
    censorEnabled = "<:xn_green_tick:1209070697939210302>";
  }
  const { guild } = interaction;

  const autoModEmbed = new EmbedBuilder()
    .setAuthor({
      name: guild.name,
      iconURL: guild
        .iconURL({
          size: 256,
        })
        ?.toString(),
    })
    .setDescription(
      `**Configure the automod** \n\n > **Link Filter** <:xn_arrow:1207610123778920448> ${linkFilterEnabled} \n > **Censor Filter** <:xn_arrow:1207610123778920448> ${censorEnabled}`
    )
    .setColor("White")
    .setThumbnail(guild.iconURL());

  const antiLinkEmbed = new EmbedBuilder()
    .setAuthor({
      name: guild.name,
      iconURL: guild
        .iconURL({
          size: 256,
        })
        ?.toString(),
    })
    .addFields(
      {
        name: "Enabled",
        value: linkFilterEnabled,
      },
      {
        name: "Threshold",
        value: `${isLinkFilterEnabled?.linkThreshold || emojis.xn_wrong}`,
      },
      {
        name: "Punishment",
        value: `${isLinkFilterEnabled?.punishMent || emojis.xn_wrong}`,
      }
    )
    .setColor("White")
    .setThumbnail(interaction.guild.iconURL());

  const censorEmbed = new EmbedBuilder()
    .setTitle(`Censor Menu`)
    .addFields(
      {
        name: "Enabled",
        value: censorEnabled,
      },
      {
        name: "Threshold",
        value: `${isCensorEnabled?.censorThreshold || "`Not Enabled`"}`,
      },
      {
        name: "Punishment",
        value: `${isCensorEnabled?.censorPunishment || "`Not Enabled`"}`,
      }
    )
    .setThumbnail(interaction.guild.iconURL())
    .setColor("White");

  const response = await interaction.reply({
    embeds: [autoModEmbed],
    components: [row],
  });
  const collectorFilter = (i: StringSelectMenuInteraction) =>
    i.user.id == interaction.user.id;
  const messageCollectorFilter = (message: Message) =>
    message.author.id == interaction.user.id;
  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: collectorFilter,
    time: 3_600_000,
  });

  collector?.on("collect", async (i: StringSelectMenuInteraction) => {
    switch (i.values[0]) {
      case "anti-link":
        await i.update({
          embeds: [antiLinkEmbed],
          components: [antiLinksRow],
        });
        break;
      case "whitelist-links":
        await i.deferReply({ ephemeral: true });
        await i.editReply({
          content: "Enter one link to whitelist",
        });

        const whiteListCollector = interaction?.channel?.createMessageCollector(
          {
            time: 60_00,
            filter: messageCollectorFilter,
          }
        );
        if (!whiteListCollector) return;
        whiteListCollector?.on("collect", async (message: any) => {
          if (!message) return;
          const contents = message.content;
          whiteListCollector?.stop();
          const isLinkExist = await antiLinkConfig.findOne(
            { guildId: interaction.guild?.id },
            { whiteListLink: contents }
          );
          if (isLinkExist) {
            await i.followUp({
              content: "Link is already white-listed in the guild",
            });
            return;
          }
          await antiLinkConfig
            .create({
              guildId: interaction?.guild?.id,
              whiteListLink: contents,
            })
            .catch(async (e) => {
              console.error(`Error in ${__filename} \n ${e}`);
              return await i.followUp({
                content: "DB Error, Try Again Later,",
                ephemeral: true,
              });
            });
          await i.followUp({
            content: "Added that message as whitelist-link",
            ephemeral: true,
          });
        });
        break;

      case "remove-whitelist-links":
        await i.deferReply({ ephemeral: true });

        const isGuildConfigured = await antiLinkConfig.findOne({
          guildId: interaction?.guild?.id,
        });
        if (!isGuildConfigured) {
          return await i.editReply({
            content: "There are no links that are configured for whitelist",
          });
        }

        await i.editReply({
          content: "Enter the links in the chat to remove from whitelist",
        });

        const removeLinkCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
            filter: messageCollectorFilter,
          });

        removeLinkCollector?.on("collect", async (message) => {
          const contents = message.content;
          removeLinkCollector.stop();
          const isLinkExist = await antiLinkConfig.findOne(
            { guildId: interaction?.guild?.id },
            { whiteListLink: contents }
          );
          if (!isLinkExist) {
            await i.followUp({
              content: "That link is not whitelisted",
              ephemeral: true,
            });
            return;
          }
          antiLinkConfig
            .findOneAndDelete(
              { guildId: interaction.guild?.id },
              {
                whiteListLink: contents,
              }
            )
            .then(() => {
              i.followUp({
                content: "Removed that link from white-list",
                ephemeral: true,
              });
            })
            .catch((err) => {
              i.followUp({
                content: "DB Error, Try Again Later",
                ephemeral: true,
              });
              return;
            });
        });
        break;
      case "disable-select":
        await i.deferReply({ ephemeral: true });
        const isEventEnabled = await antiLinkConfig.findOne({
          guildId: interaction?.guild?.id,
        });
        if (!isEventEnabled) {
          return await i.editReply({
            content: "Anti-Link system is already disabled for this guild",
          });
        }
        antiLinkConfig
          .deleteMany({
            guildId: interaction?.guild?.id,
          })
          .then(() => {
            i.followUp({
              content: "Disabled anti link system",
              ephemeral: true,
            });
          })
          .catch((err) => {
            i.followUp({
              content: "DB Error, Try Again Later",
              ephemeral: true,
            });
            return;
          });

        break;

      case "dm-select":
        await i.deferReply({ ephemeral: true });
        const isConfigured = await antiLinkConfig.findOne({
          guildId: interaction?.guild?.id,
        });

        if (!isConfigured) {
          return await i.editReply({
            content: `Please add atleast one white list link to continue`,
          });
        } else {
          await i.editReply({
            content: `Enter the dm message in chat under next 1 minute`,
          });
          const dmMessageCollector =
            interaction?.channel?.createMessageCollector({
              time: 60_000,
              filter: messageCollectorFilter,
            });
          dmMessageCollector?.on("collect", async (message) => {
            const dmMessageContent = message.content;
            dmMessageCollector?.stop();
            await antiLinkConfig
              .updateMany({
                dmMessage: dmMessageContent,
              })
              .then(async () => {
                return await i.followUp({
                  content: `Updated the dm message`,
                  ephemeral: true,
                });
              })
              .catch(async (e) => {
                console.error(e);
                await i.followUp({
                  content: `DB Error try again later`,
                });
                return;
              });

            dmMessageCollector.stop();
          });
        }

        break;

      case "reply-select":
        await i.deferReply({ ephemeral: true });
        await i.editReply({
          content: `Enter the reply message in chat under next 1 minute`,
        });
        const replyMessageCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
            filter: messageCollectorFilter,
          });
        replyMessageCollector?.on("collect", async (message) => {
          const isConfigured = await antiLinkConfig.findOne({
            guildId: interaction?.guild?.id,
          });
          if (!isConfigured) {
            await i.followUp({
              content: `Please add atleast one white list link to continue`,
            });
            return;
          }
          const replyMesssages = message.content;
          replyMessageCollector?.stop();
          antiLinkConfig
            .updateOne({
              replyMessage: replyMesssages,
            })
            .then(() => {
              i.followUp({
                content: `Updated the replyMessage`,
                ephemeral: true,
              });
            })
            .catch((e) => {
              console.error(e);
              i.followUp({
                content: `DB Error, Try again later`,
                ephemeral: true,
              });
              return;
            });
        });
        break;

      case "link-threshold":
        await i.deferReply({ ephemeral: true });
        await i.editReply({
          content: "Enter the threshold amount in chat",
        });
        const linkThresholdCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
            filter: messageCollectorFilter,
          });
        linkThresholdCollector?.on("collect", async (message) => {
          const sThreshold = message.content;
          linkThresholdCollector?.stop();
          const threshold = Number(sThreshold);
          if (isNaN(threshold)) {
            await i.followUp({
              content: "Please input a valid number under 1 to 10",
              ephemeral: true,
            });
            return;
          }
          if (threshold < 1 || threshold > 10) {
            await i.followUp({
              content: "Please input a valid number under 1 to 10",
              ephemeral: true,
            });
            return;
          }
          antiLinkConfig
            .updateMany({
              linkThreshold: threshold,
              guildId: interaction?.guild?.id,
            })
            .then(() => {
              i.followUp({
                content: `The threshold has been changed for the guild`,
                ephemeral: true,
              });
            })
            .catch((e) => {
              console.error(e);
              i.followUp({
                content: "DB Error, Try again later",
                ephemeral: true,
              });
              return;
            });
        });
        break;

      case "link-ignore-role":
        await i.deferReply({ ephemeral: true });
        const LinkIgnoreRoleCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
          });
        LinkIgnoreRoleCollector?.on("collect", async (message: any) => {
          await i.editReply(`Enter the target role **id** in chat`);
          const ignoreRoleId = message.content;
          LinkIgnoreRoleCollector?.stop();
          const ignoreRole = interaction?.guild?.roles.cache.get(ignoreRoleId);
          if (!ignoreRole) {
            await i.followUp({
              content: `Enter a valid role id`,
              ephemeral: true,
            });
            return;
          }

          ignoreConfig
            .create({
              guildId: interaction?.guild?.id,
              linkIgnoreRoleId: ignoreRoleId,
            })
            .then(() => {
              i.followUp({
                content: `Updated ignored role ${ignoreRole}`,
                ephemeral: true,
              });
            })
            .catch((err) => {
              return i.followUp({
                content: "DB Error, Try again later",
                ephemeral: true,
              });
            });
        });
        break;

      case "link-punishment":
        await i.update({
          embeds: [],
          content: "Configure Anti-Link Punishment",
          components: [linkPunishmentRow],
        });
        break;

      case "link-timeout":
        await i.deferReply({ ephemeral: true });
        const isLinkTimeoutExist = await antiLinkConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isLinkTimeoutExist) {
          return await i.editReply({
            content: "Plese add one white-list link to continue",
          });
        }
        await antiLinkConfig.findOneAndUpdate(
          { guildId: interaction.guildId },
          { punishMent: "Timeout" }
        );
        await i.editReply(`Changed censor link to **Timeout**`);
        break;

      case "link-ban":
        await i.deferReply({ ephemeral: true });
        const isLinkBanExist = await antiLinkConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isLinkBanExist) {
          return await i.editReply({
            content: "Plese add one white-list link to continue",
          });
        }
        await antiLinkConfig.findOneAndUpdate(
          { guildId: interaction.guildId },
          { punishMent: "Ban" }
        );
        await i.editReply(`Changed censor link to **Ban**`);
        break;

      case "link-kick":
        await i.deferReply({ ephemeral: true });
        const isLinkKickExist = await antiLinkConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isLinkKickExist) {
          return await i.editReply({
            content: "Plese add one whitelist link to continue",
          });
        }
        await antiLinkConfig.findOneAndUpdate(
          { guildId: interaction.guildId },
          { punishMent: "Kick" }
        );
        await i.editReply(`Changed censor link to **Kick**`);
        break;

      case "link-back":
        i.update({
          embeds: [autoModEmbed],
          components: [row],
        });

        break;

      case "link-punishment-back":
        await i.update({
          embeds: [antiLinkEmbed],
          components: [antiLinksRow],
        });
        break;

      case "censor-word":
        i.update({
          embeds: [censorEmbed],
          components: [censorWordRow],
        });
        break;

      case "censor-dm-select":
        await i.deferReply({ ephemeral: true });
        const isCensorConfigured = await censorConfig.findOne({
          guildId: interaction?.guild?.id,
        });

        if (!isCensorConfigured) {
          return await i.editReply({
            content: `Please add atleast one censor words to continue`,
          });
        } else {
          await i.editReply({
            content: `Enter the dm message in chat under next 1 minute`,
          });
          const dmMessageCollector =
            interaction?.channel?.createMessageCollector({
              time: 60_000,
              filter: messageCollectorFilter,
            });
          dmMessageCollector?.on("collect", async (message) => {
            const dmMessageContent = message.content;
            await dmMessageCollector?.stop();
            await censorConfig
              .updateMany({
                dmMessage: dmMessageContent,
              })
              .then(async () => {
                return await i
                  .followUp({
                    content: `Updated the dm message`,
                    ephemeral: true,
                  })
                  .catch(async (e) => {
                    console.error(e);
                    await i.followUp({
                      content: `DB Error try again later`,
                    });
                    return;
                  });
              });

            dmMessageCollector?.stop();
          });
        }

        break;

      case "censor-reply-select":
        await i.deferReply({ ephemeral: true });
        await i.editReply({
          content: `Enter the reply message in chat under next 1 minute`,
        });
        const censoreplyMessageCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
            filter: messageCollectorFilter,
          });
        censoreplyMessageCollector?.on("collect", async (message) => {
          const isConfigured = await censorConfig.findOne({
            guildId: interaction?.guild?.id,
          });
          if (!isConfigured) {
            await i.followUp({
              content: `Please add atleast one censor word to continue`,
            });
            return;
          }
          const replyMesssages = message.content;
          censoreplyMessageCollector?.stop();
          censorConfig
            .updateOne({
              replyMessage: replyMesssages,
            })
            .then(async () => {
              i.followUp({
                content: `Updated the replyMessage`,
                ephemeral: true,
              });
              return;
            })
            .catch(async (e) => {
              console.error(e);
              i.followUp({
                content: `DB Error, Try again later`,
                ephemeral: true,
              });
              return;
            });
        });
        break;

      case "censor-threshold":
        await i.deferReply({ ephemeral: true });
        await i.editReply({
          content: "Enter the threshold amount in chat",
        });
        const censorThresholdCollector =
          interaction?.channel?.createMessageCollector({
            time: 60_000,
            filter: messageCollectorFilter,
          });
        censorThresholdCollector?.on("collect", async (message) => {
          const sThreshold = message.content;
          censorThresholdCollector?.stop();
          const threshold = Number(sThreshold);
          if (isNaN(threshold)) {
            await i.followUp({
              content: "Please input a valid number under 1 to 10",
              ephemeral: true,
            });
            return;
          }
          if (threshold < 1 || threshold > 10) {
            await i.followUp({
              content: "Please input a valid number under 1 to 10",
              ephemeral: true,
            });
            return;
          }
          censorConfig
            .updateMany({
              censorThreshold: threshold,
              guildId: interaction?.guild?.id,
            })
            .then(() => {
              i.followUp({
                content: `The threshold has been changed for the guild`,
                ephemeral: true,
              });
            })
            .catch((e) => {
              console.error(e);
              i.followUp({
                content: "DB Error, Try again later",
                ephemeral: true,
              });
              return;
            });
        });
        break;

      case "censor-punishment":
        await i.update({
          embeds: [],
          content: "Configure Censor Words Punishment",
          components: [censorPunishmentRow],
        });
        break;

      case "censor-timeout":
        await i.deferReply({ ephemeral: true });
        const isCensorTimeoutExist = await censorConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isCensorTimeoutExist) {
          return await i.editReply({
            content: "Plese add one censor words to continue",
          });
        }
        await censorConfig.updateMany({
          guildId: interaction.guildId,
          censorPunishment: "Timeout",
        });
        await i.editReply(`Changed censor action to **Timeout**`);
        break;

      case "censor-ban":
        await i.deferReply({ ephemeral: true });
        const isCensorBanExist = await censorConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isCensorBanExist) {
          return await i.editReply({
            content: "Plese add one censor words to continue",
          });
        }
        await censorConfig
          .updateMany({
            guildId: interaction.guildId,
            censorPunishment: "Ban",
          })
          .catch(async (err) => {
            await i.editReply(`DB Error, Try again later`);
            console.error(err);
            return;
          });
        await i.editReply(`Changed censor action to **Ban**`);
        break;

      case "censor-kick":
        await i.deferReply({ ephemeral: true });
        const isCensorKickExist = await censorConfig.exists({
          guildId: interaction?.guild?.id,
        });
        if (!isCensorKickExist) {
          return await i.editReply({
            content: "Plese add one censor words to continue",
          });
        }
        await censorConfig
          .updateMany({
            guildId: interaction.guildId,
            censorPunishment: "Kick",
          })
          .catch(async (err) => {
            await i.editReply(`DB Error, Try again later`);
            console.error(err);
            return;
          });
        await i.editReply(`Changed censor action to **Kick**`);
        break;

      case "censor-punishment-back":
        await i.update({
          embeds: [],
          components: [censorWordRow],
        });
        break;

      case "censor-back":
        i.update({
          embeds: [autoModEmbed],
          components: [row],
        });
        break;
    }
  });
  collector.on("end", () => {});
}

export const options: CommandOptions = {
  devOnly: true,
};
