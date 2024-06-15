"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestionRow = void 0;
const discord_js_1 = require("discord.js");
const suggestionModuleSelectMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("suggestion-module-menu")
    .setPlaceholder("Customize The Module")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Suggestion Role")
    .setDescription("Role which can manage suggestions")
    .setValue("suggestion-role"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Suggestion Channel")
    .setDescription("Channel For Suggestion")
    .setValue("suggestion-channel"));
const suggestionRow = new discord_js_1.ActionRowBuilder().addComponents(suggestionModuleSelectMenu);
exports.suggestionRow = suggestionRow;
