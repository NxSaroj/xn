"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const tagConfig_1 = __importDefault(require("../../../models/misc/tags/tagConfig"));
exports.data = {
    name: "tag-create",
    description: "Try Out Tag Module | Under DEV",
    options: [
        {
            name: "tag-name",
            description: "The name of the tag",
            type: 3,
            required: true,
        },
    ],
    dm_permission: false,
};
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    try {
        if (!interaction.memberPermissions.has("ModerateMembers")) {
            return await interaction.reply({
                content: "You need `Moderate Members(s)` permissions to execute this command",
                ephemeral: true,
            });
        }
        const tagName = interaction.options.getString("tag-name");
        if (tagName?.includes(".") ||
            tagName?.includes(",") ||
            tagName?.includes("!")) {
            return await interaction.reply({
                content: "Tag name cannot includes zalgo characters",
                ephemeral: true,
            });
        }
        const isTagExist = await tagConfig_1.default
            .findOne({
            guildId: interaction.guild.id,
            tagName: tagName,
        });
        if (isTagExist) {
            const modal = new discord_js_1.ModalBuilder()
                .setCustomId("tag-modal")
                .setTitle("Add Tag");
            const nameInput = new discord_js_1.TextInputBuilder()
                .setCustomId("tag-name")
                .setLabel("Tag Name")
                .setValue(isTagExist.tagName)
                .setStyle(discord_js_1.TextInputStyle.Short);
            const contentInput = new discord_js_1.TextInputBuilder()
                .setCustomId("tag-content")
                .setLabel("Tag Content")
                .setValue(isTagExist.tagContent)
                .setPlaceholder("You can use TagScript Here")
                .setStyle(discord_js_1.TextInputStyle.Paragraph);
            const row1 = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
            const row2 = new discord_js_1.ActionRowBuilder().addComponents(contentInput);
            modal.addComponents(row1, row2);
            await interaction.showModal(modal);
        }
        else {
            const modal = new discord_js_1.ModalBuilder()
                .setCustomId("tag-modal")
                .setTitle("Add Tag");
            const nameInput = new discord_js_1.TextInputBuilder()
                .setCustomId("tag-name")
                .setLabel("Tag Name")
                .setStyle(discord_js_1.TextInputStyle.Short);
            const contentInput = new discord_js_1.TextInputBuilder()
                .setCustomId("tag-content")
                .setLabel("Tag Content")
                .setPlaceholder("You can use TagScript Here")
                .setStyle(discord_js_1.TextInputStyle.Paragraph);
            const row1 = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
            const row2 = new discord_js_1.ActionRowBuilder().addComponents(contentInput);
            modal.addComponents(row1, row2);
            await interaction.showModal(modal);
        }
    }
    catch (error) {
        return console.error(`Error in ${__dirname} \n Error: ${error}`);
    }
}
exports.run = run;
