const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const patreonButton = new ButtonBuilder()
.setLabel('Patreon')
.setEmoji('1216016927370117200')
.setURL('https://patreon.com/Xantrack')
.setStyle(ButtonStyle.Link)

const serverButton = new ButtonBuilder()
.setLabel('Help')
.setEmoji('1216016927370117200')
.setURL('https://discord.gg/cyTv4RFCdF')
.setStyle(ButtonStyle.Link)

const infoButton = new ButtonBuilder()
.setLabel('Info')
.setEmoji('1216016927370117200')
.setURL('https://xantrack.vercel.app')
.setStyle(ButtonStyle.Link)

const infoButtonRow = new ActionRowBuilder()
.addComponents(
    patreonButton,
    serverButton,
    infoButton
)

module.exports = infoButtonRow;