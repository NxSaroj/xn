"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkPunishmentRow = void 0;
const discord_js_1 = require("discord.js");
const linkPunishMentMenu = new discord_js_1.StringSelectMenuBuilder()
    .setCustomId("punishment-menu")
    .setPlaceholder("Punishment Options")
    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Timeout")
    .setDescription("Add timeout as automod link action")
    .setValue("link-timeout"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Ban")
    .setDescription("Add ban as automod link action")
    .setValue("link-ban"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Kick")
    .setDescription("Add kick as automod link action")
    .setValue("link-kick"), new discord_js_1.StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Go back to anti link module")
    .setValue("link-punishment-back"));
exports.linkPunishmentRow = new discord_js_1.ActionRowBuilder().addComponents(linkPunishMentMenu);
