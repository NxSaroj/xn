import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js'
const censorWordMenu = new StringSelectMenuBuilder()
.setCustomId("censor-word-menu")
.setPlaceholder("Configure censor word")
.addOptions(

  new StringSelectMenuOptionBuilder()
    .setLabel("Disable Censor Word")
    .setDescription("Disable anti link for the guild")
    .setValue("censor-disable"),

  new StringSelectMenuOptionBuilder()
    .setLabel("DM Reply")
    .setDescription("Configure the reply sent in the dm")
    .setValue("censor-dm-select"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Reply Message")
    .setDescription("Configure the message sent in the reply")
    .setValue("censor-reply-select"),

    new StringSelectMenuOptionBuilder()
    .setLabel("Censor Threshold")
    .setDescription("Configure the threshold limit")
    .setValue("censor-link-threshold"),

    new StringSelectMenuOptionBuilder()
    .setLabel("Censor Punishment")
    .setDescription("Configure the censor punishment")
    .setValue("censor-punishment"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Back to previous methods")
    .setValue("censor-back")
);


export const censorWordRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(censorWordMenu)

