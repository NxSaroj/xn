const premiumGuildConfig = require('../../models/premium/premium-guild-Config')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('list-premium-guild')
    .setDescription('list all premium Guild')
    .setDMPermission(false),
    run: async ({ interaction }) => {
        

        const guildConfigs = await premiumGuildConfig.find({})
        const guildList = guildConfigs.map(guilds => guilds.guildName).join('\n').toString()    
        
        const embed = new EmbedBuilder()
        .setTitle('Premium GUILDS')
        .setDescription(guildList || 'No Premium Guilds')
        .setColor('White')

        try {
            await interaction.reply({
                embeds: [embed]
            })
        } catch (e) {
            console.error(e)
            return await interaction.reply({
                content: 'Error camed check console',
                ephemeral: true
            })
        }

    },

    options: {
        devOnly: true,
    }
}