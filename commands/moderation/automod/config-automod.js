const {
  SlashCommandBuilder,
  EmbedBuilder,
  ComponentType,
  PermissionsBitField,
} = require("discord.js");
/** Importing Components */
const {
  censorWordRow,
} = require("../../../utilities/select-menu/censorWordMenu");
const { antiLinksRow } = require("../../../utilities/select-menu/antiLinkMenu");
const { row } = require("../../../utilities/select-menu/autoModMenu");
const {
  linkPunishmentRow,
} = require("../../../utilities/select-menu/linkPunishmentMenu");
const {
  censorPunishmentRow,
} = require("../../../utilities/select-menu/censorPunishmentMenu");

/** Importing Schema */
const antiLinkConfig = require("../../../models/moderation/automod/antiLinkConfig");
const censorConfig = require("../../../models/moderation/automod/censorConfig");
const linkIgnoreConfig = require("../../../models/moderation/automod/linkIgnoreConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-automod")
    .setDescription("Configure your automod settings")
    .setDMPermission(false),
  /**
   *
   * @param {import('commandkit').SlashCommandProps} param0
   * @returns
   */
  run: async ({ interaction }) => {
    if (!interaction.memberPermissions.has("Administrator")) {
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
        iconURL: guild.iconURL({
          size: 256,
        }),
      })
      .setDescription(
        `**Configure the automod** \n\n > **Link Filter** <:xn_arrow:1207610123778920448> ${linkFilterEnabled} \n > **Censor Filter** <:xn_arrow:1207610123778920448> ${censorEnabled}`
      )
      .setColor("White")
      .setThumbnail(guild.iconURL({}));

    const antiLinkEmbed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({
          size: 256,
        }),
      })
      .setDescription(
        `**Enabled**  <:xn_arrow:1207610123778920448> ${linkFilterEnabled}`
      )
      .setColor("White");

    const response = await interaction.reply({
      embeds: [autoModEmbed],
      components: [row],
    });

    const collectorFilter = (i) => i.user.id == interaction.user.id;

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: collectorFilter,
      time: 3_600_000,
    });

    collector.on("collect", async (i) => {
      switch (i.values[0]) {
        case "anti-link":
          await response.edit({
            embeds: [antiLinkEmbed],
            components: [antiLinksRow],
          });
          await i.reply({
            content: "Changed to link filter module",
            ephemeral: true,
          });
          break;
        case "whitelist-links":
          await i.deferReply({ ephemeral: true });
          await i.editReply({
            content: "Enter one link to whitelist",
            ephemeral: true,
          });

          const collector = interaction.channel.createMessageCollector({
            time: 60_00,
          });

          collector.on("collect", async (message) => {
            const contents = message.content;
            collector.stop();
            const isLinkExist = await antiLinkConfig.findOne({
              whiteListLink: contents,
            });
            if (isLinkExist) {
              return await i.followUp({
                content: "Link is already white-listed in the guild",
              });
            } else {
              await antiLinkConfig
                .create({
                  guildId: interaction.guild.id,
                  whiteListLink: contents,
                })
                .then(async () => {
                  return await i.followUp({
                    content: "Added that message as whitelist-link",
                    ephemeral: true,
                  });
                })
                .catch(async (e) => {
                  console.error(`Error in ${__filename} \n ${e}`);
                  return await i.followUp({
                    content: "DB Error, Try Again Later,",
                    ephemeral: true,
                  });
                });
            }
          });
          break;

        case "remove-whitelist-links":
          await i.deferReply({ ephemeral: true });

          const isGuildConfigured = await antiLinkConfig.findOne({
            guildId: interaction.guild.id,
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
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });

          removeLinkCollector.on("collect", async (message) => {
            const contents = message.content;
            removeLinkCollector.stop();
            const isLinkExist = await antiLinkConfig.findOne({
              whiteListLink: contents,
            });
            if (!isLinkExist) {
              return await i.followUp({
                content: "That link is not whitelisted",
                ephemeral: true,
              });
            } else {
              await antiLinkConfig
                .findOneAndDelete({
                  whiteListLink: contents,
                })
                .then(async () => {
                  return await i.followUp({
                    content: "Removed that link from white-list",
                    ephemeral: true,
                  });
                });
            }
          });
          break;
        case "disable-select":
          await i.deferReply({ ephemeral: true });
          const isEventEnabled = await antiLinkConfig.findOne({
            guildId: interaction.guild.id,
          });
          if (!isEventEnabled) {
            return await i.editReply({
              content: "Anti-Link system is already disabled for this guild",
            });
          }
          await antiLinkConfig
            .deleteMany({
              guildId: interaction.guild.id,
            })
            .then(async () => {
              return await i.followUp({
                content: "Disabled anti link system",
                ephemeral: true,
              });
            });
          break;

        case "dm-select":
          await i.deferReply({ ephemeral: true });
          const isConfigured = await antiLinkConfig.findOne({
            guildId: interaction.guild.id,
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
              interaction.channel.createMessageCollector({
                time: 60_000,
                filter: collectorFilter,
              });
            dmMessageCollector.on("collect", async (message) => {
              const dmMessageContent = message.content;
              await dmMessageCollector.stop();
              await antiLinkConfig
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
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });
          replyMessageCollector.on("collect", async (message) => {
            const isConfigured = await antiLinkConfig.findOne({
              guildId: interaction.guild.id,
            });
            if (!isConfigured) {
              return await i.followUp({
                content: `Please add atleast one white list link to continue`,
              });
            } else {
              const replyMesssages = message.content;
              await replyMessageCollector.stop();
              await antiLinkConfig
                .updateOne({
                  replyMessage: replyMesssages,
                })
                .then(async () => {
                  return await i.followUp({
                    content: `Updated the replyMessage`,
                    ephemeral: true,
                  });
                })
                .catch(async (e) => {
                  console.error(e);
                  return await i.followUp({
                    content: `DB Error, Try again later`,
                    ephemeral: true,
                  });
                });
            }
          });
          break;

        case "link-threshold":
          await i.deferReply({ ephemeral: true });
          await i.editReply({
            content: "Enter the threshold amount in chat",
          });
          const linkThresholdCollector =
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });
          linkThresholdCollector.on("collect", async (message) => {
            const sThreshold = message.content;
            linkThresholdCollector.stop();
            const threshold = Number(sThreshold);
            if (isNaN(threshold)) {
              return await i.followUp({
                content: "Please input a valid number under 1 to 10",
                ephemeral: true,
              });
            }
            if (threshold < 1 || threshold > 10) {
              return await i.followUp({
                content: "Please input a valid number under 1 to 10",
                ephemeral: true,
              });
            }
            await antiLinkConfig
              .updateMany({
                linkThreshold: threshold,
                guildId: interaction.guild.id,
              })
              .then(async () => {
                await i.followUp({
                  content: `The threshold has been changed for the guild`,
                  ephemeral: true,
                });
              })
              .catch(async (e) => {
                console.error(e);
                return await i.followUp({
                  content: "DB Error, Try again later",
                  ephemeral: true,
                });
              });
          });
          break;

        case "link-ignore-role":
          await i.deferReply({ ephemeral: true });
          const linkIgnoreRoleCollector =
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });
          linkIgnoreRoleCollector.on("collect", async (message) => {
            await i.editReply(`Enter the target role **Id** in chat`);
            const ignoreRoleId = message.content;
            linkIgnoreRoleCollector.stop();
            const targetIgnoreRole =
              interaction.guild.roles.cache.get(ignoreRoleId);
            if (!targetIgnoreRole) {
              return await i.followUp(`Please Enter A Valid Role`);
            }
            await linkIgnoreConfig
              .updateMany({
                guildId: interaction.guild.id,
                ignoreRoleId: ignoreRoleId,
              })
              .catch(async (err) => {
                return await i.followUp(`DB Error, Try again later`);
              });
            await i.followUp(
              `${targetIgnoreRole} of Id **${ignoreRoleId}** Has been added as link ignored role`
            );
          });
          break;

        case "link-punishment":
          await response.edit({
            embeds: [],
            content: "Configure Anti-Link Punishment",
            components: [linkPunishmentRow],
          });
          await i.reply({
            content: "Changed to link punishment module",
            ephemeral: true,
          });
          break;

        case "link-timeout":
          await i.deferReply({ ephemeral: true });
          const isLinkTimeoutExist = await antiLinkConfig.exists({
            guildId: interaction.guild.id,
          });
          if (!isLinkTimeoutExist) {
            return await i.editReply({
              content: "Plese add one white-list link to continue",
            });
          }
          await antiLinkConfig.updateMany({
            guildId: interaction.guildId,
            punishMent: "Timeout",
          });
          await i.editReply(`Changed censor link to **Timeout**`);
          break;

        case "link-ban":
          await i.deferReply({ ephemeral: true });
          const isLinkBanExist = await antiLinkConfig.exists({
            guildId: interaction.guild.id,
          });
          if (!isLinkBanExist) {
            return await i.editReply({
              content: "Plese add one white-list link to continue",
            });
          }
          await antiLinkConfig.updateMany({
            guildId: interaction.guildId,
            punishMent: "Ban",
          });
          await i.editReply(`Changed censor link to **Ban**`);
          break;

        case "link-kick":
          await i.deferReply({ ephemeral: true });
          const isLinkKickExist = await antiLinkConfig.exists({
            guildId: interaction.guild.id,
          });
          if (!isLinkKickExist) {
            return await i.editReply({
              content: "Plese add one whitelist link to continue",
            });
          }
          await antiLinkConfig.updateMany({
            guildId: interaction.guildId,
            punishMent: "Kick",
          });
          await i.editReply(`Changed censor link to **Kick**`);
          break;

        case "link-back":
          response
            .edit({
              embeds: [autoModEmbed],
              components: [row],
            })
            .then(async () => {
              await i.reply({
                content: "Change to previous methods",
                ephemeral: true,
              });
              return;
            });
          break;

        case "link-punishment-back":
          await response.edit({
            embeds: [antiLinkEmbed],
            components: [antiLinksRow],
          });
          await i.reply({
            content: "Changed Back To Anti Link",
            ephemeral: true,
          });
          break;

        case "censor-word":
          response.edit({
            embeds: [],
            components: [censorWordRow],
            content: "Configure the censor word module",
          });
          await i.reply({
            content: "Changing to censor words menu",
            ephemeral: true,
          });
          break;

        case "censor-dm-select":
          await i.deferReply({ ephemeral: true });
          const isCensorConfigured = await censorConfig.findOne({
            guildId: interaction.guild.id,
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
              interaction.channel.createMessageCollector({
                time: 60_000,
                filter: collectorFilter,
              });
            dmMessageCollector.on("collect", async (message) => {
              const dmMessageContent = message.content;
              await dmMessageCollector.stop();
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

              dmMessageCollector.stop();
            });
          }

          break;

        case "censor-reply-select":
          await i.deferReply({ ephemeral: true });
          await i.editReply({
            content: `Enter the reply message in chat under next 1 minute`,
          });
          const censoreplyMessageCollector =
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });
          censoreplyMessageCollector.on("collect", async (message) => {
            const isConfigured = await censorConfig.findOne({
              guildId: interaction.guild.id,
            });
            if (!isConfigured) {
              return await i.followUp({
                content: `Please add atleast one censor word to continue`,
              });
            } else {
              const replyMesssages = message.content;
              await censoreplyMessageCollector.stop();
              await censorConfig
                .updateOne({
                  replyMessage: replyMesssages,
                })
                .then(async () => {
                  return await i.followUp({
                    content: `Updated the replyMessage`,
                    ephemeral: true,
                  });
                })
                .catch(async (e) => {
                  console.error(e);
                  return await i.followUp({
                    content: `DB Error, Try again later`,
                    ephemeral: true,
                  });
                });
            }
          });
          break;

        case "censor-threshold":
          await i.deferReply({ ephemeral: true });
          await i.editReply({
            content: "Enter the threshold amount in chat",
          });
          const censorThresholdCollector =
            interaction.channel.createMessageCollector({
              time: 60_000,
              filter: collectorFilter,
            });
          censorThresholdCollector.on("collect", async (message) => {
            const sThreshold = message.content;
            censorThresholdCollector.stop();
            const threshold = Number(sThreshold);
            if (isNaN(threshold)) {
              return await i.followUp({
                content: "Please input a valid number under 1 to 10",
                ephemeral: true,
              });
            }
            if (threshold < 1 || threshold > 10) {
              return await i.followUp({
                content: "Please input a valid number under 1 to 10",
                ephemeral: true,
              });
            }
            await censorConfig
              .updateMany({
                censorThreshold: threshold,
                guildId: interaction.guild.id,
              })
              .then(async () => {
                await i.followUp({
                  content: `The threshold has been changed for the guild`,
                  ephemeral: true,
                });
              })
              .catch(async (e) => {
                console.error(e);
                return await i.followUp({
                  content: "DB Error, Try again later",
                  ephemeral: true,
                });
              });
          });
          break;

        case "censor-punishment":
          await response.edit({
            embeds: [],
            content: "Configure Censor Words Punishment",
            components: [censorPunishmentRow],
          });
          await i.reply({
            content: "Changed to Censor Words module",
            ephemeral: true,
          });
          break;

        case "censor-timeout":
          await i.deferReply({ ephemeral: true });
          const isCensorTimeoutExist = await censorConfig.exists({
            guildId: interaction.guild.id,
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
            guildId: interaction.guild.id,
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
            guildId: interaction.guild.id,
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
          await response.edit({
            embeds: [],
            components: [censorWordRow],
          });
          await i.reply({
            content: "Changed back the censor word module",
            ephemeral: true,
          });
          break;

        case "censor-back":
          response
            .edit({
              embeds: [autoModEmbed],
              components: [row],
            })
            .then(async () => {
              await i.reply({
                content: "Change to previous methods",
                ephemeral: true,
              });
              return;
            });
          break;
      }
    });
  },

  options: {
    devOnly: true,
  },
};
