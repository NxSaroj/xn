const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const guildConfig = require('../../models/misc/guildConfig')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('list-suggestion-channel')
    .setDescription('List all the suggestion channels')
    .setDMPermission(false),
    run: async ({ interaction }) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return await interaction.reply({
                content: "You need `Manage Channel(s)` permissions to execute this command",
                ephemeral: true
            })
        }

        const isSuggestionConfigured = await guildConfig.findOne({
            guildId: interaction.guild.id
        })

        if (!isSuggestionConfigured) {
            return await interaction.reply({
                content: "I can't list suggestion channels, as they have not been congigured",
                ephemeral: true
            })

        }
        const suggestionChannel = isSuggestionConfigured.channelId

        try {
            const embed = new EmbedBuilder()
            .setDescription(`<:xn_tick:1209742516832706642> **Suggestion Channel** <:xn_arrow:1207610123778920448> <#${suggestionChannel}>`)
            .setColor('White')
            
            await interaction.reply({
                embeds: [embed]
            })
        } catch (err) {
            await interaction.reply({
                content: "Error camed, Try again later",
                ephemeral: true
            })
            console.error(`Error in ${__filename} \n ${err}`)
            return;
        }
    }
}