import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'

const logsConfigMenu = new StringSelectMenuBuilder()
.setCustomId("logs-config-menu")
.setPlaceholder("Logs Filters")
.addOptions(
  new StringSelectMenuOptionBuilder()
  .setLabel("Enable All")
  .setDescription("Enable the logs for the guild")
  .setValue("enable-logs"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Message Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("message-logs"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Channel Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("channel-logs"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Welcome Logs")
    .setDescription("Configure the message logs for the guild")
    .setValue("welcome-logs")
);

export const logsConfigRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(logsConfigMenu)
