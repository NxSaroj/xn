"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.row = void 0;
const discord_js_1 = require("discord.js");
const autoModSelectMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("automod-menu")
    .setPlaceholder("Automod Filters")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Anti-Link-Filter")
    .setDescription("Confgure anti-link filter for the guild")
    .setValue("anti-link"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Censor-Words filter")
    .setDescription("Confgure ban word filter for the guild")
    .setValue("censor-word"));
exports.row = new discord_js_1.ActionRowBuilder().addComponents(autoModSelectMenu);
