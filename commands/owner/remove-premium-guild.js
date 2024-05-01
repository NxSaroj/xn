const premiumGuildConfig = require('../../models/premium/premium-guild-Config')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-premium-guild')
    .setDescription('remove a premium Guild')
    .addStringOption((option)=>option.setName('guild-id').setDescription('The ID of that guild').setRequired(true))
    .setDMPermission(false),
    run: async ({ interaction, client, handler }) => {
       
        const guildId = interaction.options.getString('guild-id')
        const guildName = client.guilds.cache.get(guildId)

        if (!guildName) {
            return await interaction.reply({
                content: 'Not able to found the guild \n Make sure the bot is in the server',
                ephemeral: true,
            })
        }

        const isPremium = await premiumGuildConfig.findOne({ guildName: guildName })
        if (!isPremium) {
            return await interaction.reply({
                content: 'That guild is not configured for premium',
                ephemeral: true,
            })
        }


        

        try {
            await premiumGuildConfig.findOneAndDelete({
                guildId: guildId,
                guildName: guildName

            }).then(async()=>{
                const embed = new EmbedBuilder()
                .setDescription(`> **Guild Removed** <:xn_arrow:1206238725130952755> ${guildName}`)
                .setColor('White')
                return await interaction.reply({
                    embeds: [embed]
                })
            }).catch(async(e)=>{
                console.error(e)
                return await interaction.reply({
                    content: 'DB Error, try again later',
                    ephemeral: true,
                })
            })
        } catch (e) {
            console.error(e)
            return await interaction.reply({
                content: 'Error whilte removing guild, Try again later',
                ephemeral: true
            })
        }

    },

    options: {
        devOnly: true,
    }
}