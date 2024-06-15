"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const triggerConfig_1 = __importDefault(require("../../../models/misc/tags/triggerConfig"));
const premium_guild_Config_1 = __importDefault(require("../../../models/premium/premium-guild-Config"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("create-trigger")
    .setDescription("Create a trigger for the guild")
    .addStringOption((option) => option
    .setName("trigger-name")
    .setDescription("The name of the trigger, case sensitive")
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.memberPermissions.has("ManageMessages")) {
        return await interaction.reply({
            content: "You need to have `Manage Message` Permission to execute this command",
            ephemeral: true
        });
    }
    const triggerName = interaction.options.getString("trigger-name");
    try {
        const triggerGuild = interaction.guild.id;
        const lengthTrigger = await triggerConfig_1.default.find({
            guildId: triggerGuild,
        });
        const isPremiumGuild = await premium_guild_Config_1.default.findOne({
            guildId: triggerGuild,
        });
        if (!isPremiumGuild) {
            if (lengthTrigger.length >= 10) {
                return await interaction.reply({
                    content: "Trigger creation limit has been reached\n Try patreon to increase the limit",
                    ephemeral: true,
                });
            }
        }
        else if (lengthTrigger.length >= 35) {
            return await interaction.reply({
                content: "Trigger creation limit has been reached\n Try patreon to increase the limit",
                ephemeral: true,
            });
        }
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
    }
    const isTriggerCreated = await triggerConfig_1.default.findOne({
        triggerName: triggerName,
        guildId: interaction.guild.id,
    });
    if (isTriggerCreated) {
        const triggerDBName = isTriggerCreated.triggerName;
        const triggerDBContent = isTriggerCreated.triggerContent;
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("trigger-modal")
            .setTitle("Add Trigger");
        const nameInput = new discord_js_1.TextInputBuilder()
            .setCustomId("trigger-name")
            .setValue(triggerDBName.toString())
            .setLabel("Trigger Name")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const contentInput = new discord_js_1.TextInputBuilder()
            .setCustomId("trigger-content")
            .setValue(triggerDBContent.toString())
            .setLabel("Trigger Content")
            .setPlaceholder("You can use plcaeholders here join the support server for help")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const row1 = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
        const row2 = new discord_js_1.ActionRowBuilder().addComponents(contentInput);
        modal.addComponents(row1, row2);
        try {
            await interaction.showModal(modal);
        }
        catch (e) {
            console.error(`Error in ${__filename} \n ${e}`);
        }
    }
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId("trigger-modal")
        .setTitle("Add Trigger");
    const nameInput = new discord_js_1.TextInputBuilder()
        .setCustomId("trigger-name")
        .setLabel("Trigger Name")
        .setValue(triggerName)
        .setStyle(discord_js_1.TextInputStyle.Short);
    const contentInput = new discord_js_1.TextInputBuilder()
        .setCustomId("trigger-content")
        .setLabel("Trigger Content")
        .setPlaceholder("You can use plcaeholders here join the support server for help")
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const row1 = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
    const row2 = new discord_js_1.ActionRowBuilder().addComponents(contentInput);
    modal.addComponents(row1, row2);
    try {
        await interaction.showModal(modal);
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
    }
}
exports.run = run;
