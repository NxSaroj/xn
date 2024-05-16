const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonStyle,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create & send a embed to a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send embed")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .setDMPermission(false),
  run: async ({ interaction }) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return await interaction.reply({
        content:
          "You need `Manage Message(s)` permissions to execute this command",
        ephemeral: true,
      });
    }
    const channel = interaction.options.getChannel("channel");
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
      .setLabel("Send")
      .setStyle(ButtonStyle.Secondary);

    const jsonButton = new ButtonBuilder()
      .setCustomId("json")
      .setLabel("JSON")
      .setStyle(ButtonStyle.Danger);

    const button1Row = new ActionRowBuilder().addComponents(
      titleButton,
      discButton,
      imgButton
    );

    const button2Row = new ActionRowBuilder().addComponents(
      thumbButton,
      colorButton,
      jsonButton
    );

    const button3Row = new ActionRowBuilder().addComponents(saveButton);
    await interaction.deferReply();

    const reply = await interaction.editReply({
      embeds: [previeEmbed],
      components: [button1Row, button2Row, button3Row],
    });

    const interactionFilter = (i) => i.user.id === interaction.user.id;

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
          const messageCollectorFilter = (m) =>
            m.author.id == interaction.user.id;

          const messageCollector = interaction.channel.createMessageCollector({
            filter: messageCollectorFilter,
            time: 60000,
            max: 1,
          });

          messageCollector.on("collect", (m) => {
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
          const secondMessageFilter = (m) => m.author.id == interaction.user.id;

          const secondMessageCollector =
            interaction.channel.createMessageCollector({
              filter: secondMessageFilter,
              time: 60000,
              max: 1,
            });

          secondMessageCollector.on("collect", async (m) => {
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
          const thirdMessageFilter = (m) => m.author.id == interaction.user.id;
          const thirdMessageCollector =
            interaction.channel.createMessageCollector({
              filter: thirdMessageFilter,
              time: 60000,
              max: 1,
            });

          thirdMessageCollector.on("collect", async (m) => {
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
          const fourthMessageFilter = (m) => m.author.id == interaction.user.id;
          const fourthMessageCollector =
            interaction.channel.createMessageCollector({
              filter: fourthMessageFilter,
              time: 60000,
              max: 1,
            });
          fourthMessageCollector.on("collect", async (m) => {
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
          const fifthMessageFilter = (m) => m.author.id == interaction.user.id;
          const fifthMessageCollector =
            interaction.channel.createMessageCollector({
              filter: fifthMessageFilter,
              time: 60_000,
              max: 1,
            });
          fifthMessageCollector.on("collect", async (m) => {
            const nowColor = m.content;

            try {
              previeEmbed.setColor(nowColor);
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

        if (i.customId == "json") {
          await i.reply({
            content: "Enter the raw json in chat",
            ephemeral: true,
          });

          const sixthMessageFilter = (m) => m.author.id == interaction.user.id;
          const sixthMessageCollector =
            interaction.channel.createMessageCollector({
              filter: sixthMessageFilter,
              time: 60_000,
              max: 1,
            });

          sixthMessageCollector.on("collect", async (m) => {
            const json = JSON.stringify(m.content)
            await sixthMessageCollector.stop();
            reply.edit({ embeds: [json] }).catch((err) => {
              return i.followUp({ content: "Invalid JSON", ephemeral: true });
            });
          });
        }

        if (i.customId === "save") {
          try {
            await channel
              .send({
                embeds: [previeEmbed],
              })
              .then(async () => {
                await i.reply({
                  content: `Embed sent to ${channel}`,
                  ephemeral: true,
                });
              })
              .then(async () => {
                setTimeout(async () => {
                  await reply.delete();
                }, 2000);
              });
          } catch (e) {
            await i.reply({
              content: "Cant send embed to that channel",
              ephemeral: true,
            });

            console.error(e);
            return;
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
};
