import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js'

const autoModSelectMenu = new StringSelectMenuBuilder()
.setCustomId("automod-menu")
.setPlaceholder("Automod Filters")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("Anti-Link-Filter")
    .setDescription("Confgure anti-link filter for the guild")
    .setValue("anti-link"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Censor-Words filter")
    .setDescription("Confgure ban word filter for the guild")
    .setValue("censor-word")
);

export const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(autoModSelectMenu);

