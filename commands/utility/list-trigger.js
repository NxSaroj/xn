const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const triggerConfig = require("../../models/misc/tags/triggerConfig");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-trigger')
        .setDescription('List all the triggers of the guild')
        .setDMPermission(false),

    run: async ({ interaction }) => {
        const triggers = await triggerConfig.find({ guildId: interaction.guild.id });

        if (!triggers || triggers.length === 0) {
            return await interaction.reply({
                content: 'No triggers found',
                ephemeral: true,
            });
        }


        const response = await interaction.reply({
            content: 'Fetching the triggers list...'
        })

        try {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ size: 256 })
                })
                .setDescription(`**Triggers Fetched**\n\n${triggers.map((trigger) => `**${trigger.triggerName}**`).join('\n')}`)
                .setColor('White');
        
            return await response.edit({
                content: '',
                embeds: [embed],
            });
        } catch (e) {
            await interaction.reply({
                content: 'Error occured, Try again later',
                ephemeral: true,
            })
            console.log(e);
        }
    },


};