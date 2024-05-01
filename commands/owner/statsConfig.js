const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js')
/**
 * @param {Client} client
 */
module.exports = {
    data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get stats about xantrack')
    .setDMPermission(false),
    run: async ({ interaction, client }) => {

        if (interaction.user.id !== '1129393606432661575') {
            return await interaction.reply({
                content: 'This command is owner exclusive',
                ephemeral: true,
            })
        }
      
        const response = await interaction.reply({
            content: 'Fetching bots stats...'
        })
        const { default: prettyMilliseconds } = await import("pretty-ms");


        const statsEmbed = new EmbedBuilder() 
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 256 }) })
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`**Bot Stats Fetched** \n\n >  **Total Servers** <:xn_arrow:1206238725130952755> ${client.guilds.cache.size} \n\n **Uptime** \n\n > ${prettyMilliseconds(client.uptime)} `)
        .setColor('White')

        try {
            response.edit({
                content: '',
                embeds: [statsEmbed]
            })
        } catch (err) {
            await response.edit({
                content: 'Error while fetching stats'
            })
            console.error(e)
            return;
        }

    },

    options: {
        devOnly: true,
    }

}