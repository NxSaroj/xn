"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create & send a embed to a channel")
    .addChannelOption((option) => option
    .setName("channel")
    .setDescription("The channel to send embed")
    .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement)
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageMessages)) {
        return await interaction.reply({
            content: "You need `Manage Message(s)` permissions to execute this command",
            ephemeral: true,
        });
    }
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const previeEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Embd Title Preview")
        .setDescription("This is preview of your embed description")
        .setColor("White");
    const titleButton = new discord_js_1.ButtonBuilder()
        .setCustomId("title")
        .setLabel("Title")
        .setStyle(discord_js_1.ButtonStyle.Success);
    const discButton = new discord_js_1.ButtonBuilder()
        .setCustomId("disc")
        .setLabel("Description")
        .setStyle(discord_js_1.ButtonStyle.Success);
    const imgButton = new discord_js_1.ButtonBuilder()
        .setCustomId("img")
        .setLabel("Image")
        .setStyle(discord_js_1.ButtonStyle.Success);
    const thumbButton = new discord_js_1.ButtonBuilder()
        .setCustomId("thumb")
        .setLabel("Thumbnail")
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const colorButton = new discord_js_1.ButtonBuilder()
        .setCustomId("color")
        .setLabel("Color")
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const saveButton = new discord_js_1.ButtonBuilder()
        .setCustomId("save")
        .setLabel("Send")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const jsonButton = new discord_js_1.ButtonBuilder()
        .setCustomId("json")
        .setLabel("JSON")
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const button1Row = new discord_js_1.ActionRowBuilder().addComponents(titleButton, discButton, imgButton);
    const button2Row = new discord_js_1.ActionRowBuilder().addComponents(thumbButton, colorButton, jsonButton);
    const button3Row = new discord_js_1.ActionRowBuilder().addComponents(saveButton);
    await interaction.deferReply();
    const reply = await interaction.editReply({
        embeds: [previeEmbed],
        components: [button1Row, button2Row, button3Row],
    });
    const interactionFilter = (i) => i.user.id === interaction.user.id;
    try {
        const confirmation = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            filter: interactionFilter,
        });
        confirmation.on("collect", async (i) => {
            if (i.customId === "title") {
                await i.reply({
                    content: "Type & send the title in chat",
                    ephemeral: true,
                });
                const messageCollectorFilter = (m) => m.author.id == interaction.user.id;
                const messageCollector = interaction.channel?.createMessageCollector({
                    filter: messageCollectorFilter,
                    time: 60000,
                    max: 1,
                });
                messageCollector?.on("collect", (m) => {
                    const nowTitle = m.content;
                    try {
                        previeEmbed.setTitle(nowTitle);
                        reply.edit({ embeds: [previeEmbed] });
                    }
                    catch (e) {
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
                const secondMessageCollector = interaction.channel?.createMessageCollector({
                    filter: secondMessageFilter,
                    time: 60000,
                    max: 1,
                });
                secondMessageCollector?.on("collect", async (m) => {
                    const nowDescription = m.content;
                    try {
                        previeEmbed.setDescription(nowDescription);
                        reply.edit({ embeds: [previeEmbed] });
                    }
                    catch (e) {
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
                const thirdMessageCollector = interaction.channel?.createMessageCollector({
                    filter: thirdMessageFilter,
                    time: 60000,
                    max: 1,
                });
                thirdMessageCollector?.on("collect", async (m) => {
                    const nowImage = m.content;
                    try {
                        previeEmbed.setImage(nowImage);
                        reply.edit({ embeds: [previeEmbed] });
                    }
                    catch (e) {
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
                const fourthMessageCollector = interaction.channel?.createMessageCollector({
                    filter: fourthMessageFilter,
                    time: 60000,
                    max: 1,
                });
                fourthMessageCollector?.on("collect", async (m) => {
                    const nowThumbnail = m.content;
                    try {
                        if (nowThumbnail == `{target(avatar)}`) {
                            return console.log("Done");
                        }
                        else {
                            previeEmbed.setThumbnail(nowThumbnail);
                            reply.edit({ embeds: [previeEmbed] });
                        }
                    }
                    catch (e) {
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
                const fifthMessageCollector = interaction.channel?.createMessageCollector({
                    filter: fifthMessageFilter,
                    time: 60000,
                    max: 1,
                });
                fifthMessageCollector?.on("collect", async (m) => {
                    const nowColor = m.content;
                    try {
                        previeEmbed.setColor(nowColor);
                        reply.edit({ embeds: [previeEmbed] });
                    }
                    catch (e) {
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
                const sixthMessageCollector = interaction.channel?.createMessageCollector({
                    filter: sixthMessageFilter,
                    time: 60000,
                    max: 1,
                });
                sixthMessageCollector?.on("collect", async (m) => {
                    const json = JSON.stringify(m.content);
                    await sixthMessageCollector.stop();
                    reply.edit({ embeds: [] }).catch((err) => {
                        return i.followUp({ content: "Invalid JSON", ephemeral: true });
                    });
                });
            }
            if (i.customId === "save") {
                try {
                    if (!channel?.isTextBased())
                        return;
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
                }
                catch (e) {
                    await i.reply({
                        content: "Cant send embed to that channel",
                        ephemeral: true,
                    });
                    console.error(e);
                    return;
                }
            }
        });
    }
    catch (e) {
        console.error(e);
    }
}
exports.run = run;
