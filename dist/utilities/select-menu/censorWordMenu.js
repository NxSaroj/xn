"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.censorWordRow = void 0;
const discord_js_1 = require("discord.js");
const censorWordMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("censor-word-menu")
    .setPlaceholder("Configure censor word")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Disable Censor Word")
    .setDescription("Disable anti link for the guild")
    .setValue("censor-disable"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("DM Reply")
    .setDescription("Configure the reply sent in the dm")
    .setValue("censor-dm-select"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Reply Message")
    .setDescription("Configure the message sent in the reply")
    .setValue("censor-reply-select"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Censor Threshold")
    .setDescription("Configure the threshold limit")
    .setValue("censor-link-threshold"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Censor Punishment")
    .setDescription("Configure the censor punishment")
    .setValue("censor-punishment"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Back to previous methods")
    .setValue("censor-back"));
exports.censorWordRow = new discord_js_1.ActionRowBuilder().addComponents(censorWordMenu);
