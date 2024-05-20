import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js'


const linkPunishMentMenu = new StringSelectMenuBuilder()
.setCustomId("punishment-menu")
.setPlaceholder("Punishment Options")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("Timeout")
    .setDescription("Add timeout as automod link action")
    .setValue("link-timeout"),
  new StringSelectMenuOptionBuilder()
    .setLabel("Ban")
    .setDescription("Add ban as automod link action")
    .setValue("link-ban"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Kick")
    .setDescription("Add kick as automod link action")
    .setValue("link-kick"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Go back to anti link module")
    .setValue("link-punishment-back")
);

export const linkPunishmentRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(linkPunishMentMenu)
