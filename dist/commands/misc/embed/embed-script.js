"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const sourcebin_1 = require("sourcebin");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("embed-script")
    .setDescription("Get the script of the embed message")
    .addStringOption((option) => option
    .setName("message-id")
    .setDescription("Input the message id of embed")
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageMessages)) {
        return await interaction.reply({
            content: "**Required Permissions** <:xn_arrow:1206238725130952755> `Adminstrator()`",
            ephemeral: true,
        });
    }
    const messageId = interaction.options.getString("message-id");
    if (!messageId)
        return;
    const message = await interaction?.channel?.messages
        .fetch(messageId)
        .catch(async () => {
        return await interaction.reply({
            content: "No messages found, Run this command on the same channel where embed is sent",
            ephemeral: true,
        });
    });
    const messageEmbed = message.embeds[0];
    if (!messageEmbed || message.embeds.length == 0) {
        return await interaction.reply({
            content: "No embeds found in that message",
            ephemeral: true,
        });
    }
    const response = await interaction.reply(`Embed Script Under Progress`);
    const jsonBin = await (0, sourcebin_1.create)({
        files: [
            {
                content: `\n${JSON.stringify(messageEmbed, null, 2)}\n`,
                language: "javascript",
            },
        ],
    });
    try {
        await response
            .edit({
            content: `**Embed Script** > ${jsonBin.url}`,
        })
            .catch(async (e) => {
            return console.error(e);
        });
    }
    catch (e) {
        console.error(e);
        response.edit({
            content: "Error camed with the api, try again later",
        });
    }
}
exports.run = run;
