const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')

const suggestionModuleSelectMenu = new StringSelectMenuBuilder()
.setCustomId("suggestion-module-menu")
.setPlaceholder("Customize The Module")
.addOptions(
  new StringSelectMenuOptionBuilder()
    .setLabel("Suggestion Role")
    .setDescription("Role which can manage suggestions")
    .setValue("suggestion-role"),
)

const suggestionRow = new ActionRowBuilder().addComponents(suggestionModuleSelectMenu)

module.exports = {
    suggestionRow
}