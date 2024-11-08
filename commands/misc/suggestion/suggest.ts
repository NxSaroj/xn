import {  ActionRowBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction } from 'discord.js';
import guildConfig from '../../../models/misc/guildConfig'
import { SlashCommandProps } from 'commandkit';
export const data = new SlashCommandBuilder()
.setName('suggest')
.setDescription('Suggest anything in the guild')
.setDMPermission(false)

export async function run({ interaction }:SlashCommandProps) {
if (!interaction.inCachedGuild()) return;

const isSuggestionEnabled = await guildConfig.exists({
    guildId: interaction.guild.id
})

if (!isSuggestionEnabled) {
    return await interaction.reply({
        content: "You can't create suggestion in this server, as it has not been configured",
        ephemeral: true
    })
}


const suggestionModal = new ModalBuilder()
.setCustomId('suggestion-modal')
.setTitle('Suggestion Area')

const suggestionContentInput = new TextInputBuilder()
.setCustomId('suggestion-content')
.setLabel('Enter your suggestion')
.setPlaceholder('Type your suggestion here')
.setMaxLength(820)
.setStyle(TextInputStyle.Paragraph)

const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
    suggestionContentInput
)

suggestionModal.addComponents(row)

try {
    await interaction.showModal(suggestionModal)
} catch (err) {
    console.error(`Error in ${__filename} \n ${err}`)
    await interaction.reply({
        content: 'Error camed, try again later',
        ephemeral: true
    })
    return;
}
}