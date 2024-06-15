"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const patreonButton = new discord_js_1.ButtonBuilder()
    .setLabel('Patreon')
    .setEmoji('1216016927370117200')
    .setURL('https://patreon.com/Xantrack')
    .setStyle(discord_js_1.ButtonStyle.Link);
const serverButton = new discord_js_1.ButtonBuilder()
    .setLabel('Help')
    .setEmoji('1216016927370117200')
    .setURL('https://discord.gg/cyTv4RFCdF')
    .setStyle(discord_js_1.ButtonStyle.Link);
const infoButton = new discord_js_1.ButtonBuilder()
    .setLabel('Info')
    .setEmoji('1216016927370117200')
    .setURL('https://xantrack.vercel.app')
    .setStyle(discord_js_1.ButtonStyle.Link);
const infoButtonRow = new discord_js_1.ActionRowBuilder()
    .addComponents(patreonButton, serverButton, infoButton);
exports.default = infoButtonRow;
