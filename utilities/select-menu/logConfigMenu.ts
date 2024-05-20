import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'

const logsConfigMenu = new StringSelectMenuBuilder()
.setCustomId("logs-config-menu")
.setPlaceholder("Logs Filters")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("Message Logs")
    .setDescription("Confgure the message logs for the guild")
    .setValue("message-logs"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Channel Logs")
    .setDescription("Confgur the message logs for the guild")
    .setValue("channel-logs"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Welcome Logs")
    .setDescription("Confgur the message logs for the guild")
    .setValue("welcome-logs")
);

export const logsConfigRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(logsConfigMenu)
