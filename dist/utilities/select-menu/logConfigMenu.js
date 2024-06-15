"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsConfigRow = void 0;
const discord_js_1 = require("discord.js");
const logsConfigMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("logs-config-menu")
    .setPlaceholder("Logs Filters")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Enable All")
    .setDescription("Enable the logs for the guild")
    .setValue("enable-logs"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Message Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("message-logs"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Channel Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("channel-logs"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Welcome Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("welcome-logs"));
exports.logsConfigRow = new discord_js_1.ActionRowBuilder().addComponents(logsConfigMenu);
