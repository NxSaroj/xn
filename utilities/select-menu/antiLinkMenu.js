const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')

const antiLinkSelectMenu = new StringSelectMenuBuilder()
.setCustomId("anti-link-menu")
.setPlaceholder("Configure Anti Link")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("White List Links")
    .setDescription("Confgure white-list links for the guild")
    .setValue("whitelist-links"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Remove WhiteList Liks")
    .setDescription("Remove whitelist-linkfor the guild")
    .setValue("remove-whitelist-links"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Disable Anti Link")
    .setDescription("Disable anti link for the guild")
    .setValue("disable-select"),

  new StringSelectMenuOptionBuilder()
    .setLabel("DM Reply")
    .setDescription("Configure the reply sent in the dm")
    .setValue("dm-select"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Reply Message")
    .setDescription("Configure the message sent in the reply")
    .setValue("reply-select"),

    new StringSelectMenuOptionBuilder()
    .setLabel("Link Threshold")
    .setDescription("Configure the threshold limit")
    .setValue("link-threshold"),

    new StringSelectMenuOptionBuilder()
    .setLabel("Ignore Role")
    .setDescription("Add a ignored role to anti ling")
    .setValue("link-ignore-role"),

    new StringSelectMenuOptionBuilder()
    .setLabel("Link Punishment")
    .setDescription("Change the punishment")
    .setValue("link-punishment"),

  new StringSelectMenuOptionBuilder()
    .setLabel("Back")
    .setDescription("Back to previous methods")
    .setValue("link-back")
);

const antiLinksRow = new ActionRowBuilder().addComponents(
    antiLinkSelectMenu
  );

  module.exports = {
    antiLinksRow
  }