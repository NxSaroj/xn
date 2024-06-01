import {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  type ColorResolvable
} from "discord.js";
import welcomeConfig from "../../models/welcome/welcomeConfig";
import type { SlashCommandProps } from "commandkit";

export const data: any = new SlashCommandBuilder()
  .setName("add-welcome-channel")
  .setDescription(
    "Templates - {target(user.mention)}, {target(user.username)}, {guild.name}"
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel you want to add")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
  )
  .setDMPermission(false);

export async function run({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  try {
    const channel = interaction.options.getChannel("channel");
    const isGuildConfigured = await welcomeConfig.findOne({
      guildId: interaction.guild.id,
    });
    if (isGuildConfigured) {
      return await interaction.reply({
        content:
          "Welcome system has already been configured \n Run `/remove-welcome-channel` to remove welcome channel",
        ephemeral: true,
      });
    }
    const isChannelConfigured = await welcomeConfig.findOne({
      channelId: channel?.id,
    });
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content:
          "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
        ephemeral: true,
      });
    }
    if (isChannelConfigured) {
      return await interaction.reply({
        content: `${channel} is already configured for welcome`,
        ephemeral: true,
      });
    } else {
      const previeEmbed = new EmbedBuilder()
        .setTitle("Embd Title Preview")
        .setDescription("This is preview of your embed description")
        .setColor("White");

      const titleButton = new ButtonBuilder()
        .setCustomId("title")
        .setLabel("Title")
        .setStyle(ButtonStyle.Success);

      const discButton = new ButtonBuilder()
        .setCustomId("disc")
        .setLabel("Description")
        .setStyle(ButtonStyle.Success);

      const imgButton = new ButtonBuilder()
        .setCustomId("img")
        .setLabel("Image")
        .setStyle(ButtonStyle.Success);

      const thumbButton = new ButtonBuilder()
        .setCustomId("thumb")
        .setLabel("Thumbnail")
        .setStyle(ButtonStyle.Danger);

      const colorButton = new ButtonBuilder()
        .setCustomId("color")
        .setLabel("Color")
        .setStyle(ButtonStyle.Danger);

      const saveButton = new ButtonBuilder()
        .setCustomId("save")
        .setLabel("Save")
        .setStyle(ButtonStyle.Secondary);

      const button1Row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        titleButton,
        discButton,
        imgButton
      );

      const button2Row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        thumbButton,
        colorButton,
        saveButton
      );
      await interaction.deferReply();

      const reply = await interaction.editReply({
        embeds: [previeEmbed],
        components: [button1Row, button2Row],
      });

      const interactionFilter = (i: import('discord.js').ButtonInteraction) => i.user.id === interaction.user.id;

      try {
        const confirmation = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          filter: interactionFilter,
        });

        confirmation.on("collect", async (i) => {
          if (i.customId === "title") {
            await i.reply({
              content: "Type & send the title in chat",
              ephemeral: true,
            });
            const messageCollectorFilter = (m:import('discord.js').Message) =>
              m.author.id == interaction.user.id;

            const messageCollector = interaction?.channel?.createMessageCollector(
              {
                filter: messageCollectorFilter,
                time: 60000,
                max: 1,
              }
            );

            messageCollector?.on("collect", (m) => {
              const nowTitle = m.content;
              try {
                previeEmbed.setTitle(nowTitle);
                reply.edit({ embeds: [previeEmbed] });
              } catch (e) {
                console.error(e);
                i.followUp({
                  content: "Try again with a valid title",
                  ephemeral: true,
                });
              }
            });
          }

          if (i.customId === "disc") {
            await i.reply({
              content: "Type & send the description in chat",
              ephemeral: true,
            });
            const secondMessageFilter = (m:import('discord.js').Message) =>
              m.author.id == interaction.user.id;

            const secondMessageCollector =
              interaction?.channel?.createMessageCollector({
                filter: secondMessageFilter,
                time: 60000,
                max: 1,
              });

            secondMessageCollector?.on("collect", async (m) => {
              const nowDescription = m.content;
              try {
                previeEmbed.setDescription(nowDescription);
                reply.edit({ embeds: [previeEmbed] });
              } catch (e) {
                await i.followUp({
                  content: "Try again with a valid description",
                  ephemeral: true,
                });
                console.error(e);
              }
            });
          }

          if (i.customId === "img") {
            await i.reply({
              content: "Type & send the image link in chat",
              ephemeral: true,
            });
            const thirdMessageFilter = (m:import('discord.js').Message) =>
              m.author.id == interaction.user.id;
            const thirdMessageCollector =
              interaction?.channel?.createMessageCollector({
                filter: thirdMessageFilter,
                time: 60000,
                max: 1,
              });

            thirdMessageCollector?.on("collect", async (m) => {
              const nowImage = m.content;

              try {
                previeEmbed.setImage(nowImage);
                reply.edit({ embeds: [previeEmbed] });
              } catch (e) {
                await i.followUp({
                  content: "Try again with a valid image url",
                  ephemeral: true,
                });
                console.error(e);
              }
            });
          }

          if (i.customId === "thumb") {
            await i.reply({
              content: "Type & send the thumbnail link in chat",
              ephemeral: true,
            });
            const fourthMessageFilter = (m:import('discord.js').Message) =>
              m.author.id == interaction.user.id;
            const fourthMessageCollector =
              interaction?.channel?.createMessageCollector({
                filter: fourthMessageFilter,
                time: 60000,
                max: 1,
              });
            fourthMessageCollector?.on("collect", async (m) => {
              const nowThumbnail = m.content;

              try {
                if (nowThumbnail == `{target(avatar)}`) {
                  return console.log("Done");
                } else {
                  previeEmbed.setThumbnail(nowThumbnail);
                  reply.edit({ embeds: [previeEmbed] });
                }
              } catch (e) {
                await i.followUp({
                  content: "Try again with a valid thumbnail url",
                  ephemeral: true,
                });
                console.error(e);
              }
            });
          }

          if (i.customId === "color") {
            await i.reply({
              content: "Type & send the color code in chat",
              ephemeral: true,
            });
            const fifthMessageFilter = (m:import('discord.js').Message) =>
              m.author.id == interaction.user.id;
            const fifthMessageCollector =
              interaction?.channel?.createMessageCollector({
                filter: fifthMessageFilter,
                time: 60_000,
                max: 1,
              });
            fifthMessageCollector?.on("collect", async (m:import('discord.js').Message) => {
              const nowColor = m.content 
              
              try {
                previeEmbed.setColor(nowColor as ColorResolvable)
                reply.edit({ embeds: [previeEmbed] });
              } catch (e) {
                await i.followUp({
                  content: "Try again with a valid hex color code",
                  ephemeral: true,
                });
                console.error(e);
              }
            });
          }

          if (i.customId === "save") {
            await i.deferReply({ ephemeral: true });
            try {
              await i.followUp({
                content: "Type and enter custom message in chat",
                ephemeral: true,
              });
              const sixthMessageFilter = (m: import('discord.js').Message) =>
                m.author.id == interaction.user.id;
              const sixthMessageCollector =
                interaction?.channel?.createMessageCollector({
                  filter: sixthMessageFilter,
                  time: 60_000,
                  max: 1,
                });
              sixthMessageCollector?.on("collect", async (m) => {
                const messageToSend = m.content;

                await welcomeConfig
                  .create({
                    channelId: channel?.id,
                    guildId: interaction.guild.id,
                    customMessage: previeEmbed,
                    messageContent: messageToSend,
                  })
                  .then(async () => {
                    return await i.followUp({
                      content: `${channel} Has been configured for welcome messages`,
                      ephemeral: true,
                    });
                  });
              });
            } catch (e) {
              console.error(e);
            }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.log(`Error in ${__filename} \n ${e}`);
  }
}
