"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.censorPunishmentRow = void 0;
const discord_js_1 = require("discord.js");
const censorPunishmentMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("censor-punishment-menu")
    .setPlaceholder("Punishment Options")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Timeout")
    .setDescription("Add timeout as automod censor action")
    .setValue("censor-timeout"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Ban")
    .setDescription("Add ban as automod censor action")
    .setValue("censor-ban"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Kick")
    .setDescription("Add kick as automod censor action")
    .setValue("censor-kick"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Go back to anti censor module")
    .setValue("censor-punishment-back"));
exports.censorPunishmentRow = new discord_js_1.ActionRowBuilder().addComponents(censorPunishmentMenu);
