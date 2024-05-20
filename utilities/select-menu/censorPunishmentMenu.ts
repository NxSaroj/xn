import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js'


const censorPunishmentMenu = new StringSelectMenuBuilder()
.setCustomId("censor-punishment-menu")
.setPlaceholder("Punishment Options")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("Timeout")
    .setDescription("Add timeout as automod censor action")
    .setValue("censor-timeout"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Ban")
    .setDescription("Add ban as automod censor action")
    .setValue("censor-ban"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Kick")
    .setDescription("Add kick as automod censor action")
    .setValue("censor-kick"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Go back to anti censor module")
    .setValue("censor-punishment-back")
);

export const censorPunishmentRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(censorPunishmentMenu)

