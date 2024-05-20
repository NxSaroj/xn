const { ButtonStyle, ButtonBuilder } = require('discord.js');
const { emojis } = require('../json/config.json')
/**
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @param {*} page 
 * @param {*} time 
 */
module.exports = async (interaction, pages, time = 30*1000) => {
    if (!interaction || !pages || !pages > 0) throw new Error('Invalid Args')
        await interaction.deferReply()
    if (pages.length == 0) {
         await interaction.editReply({
            embeds: pages,
            components: [], 
            fetchReply: true
        })
        return;
    }

    const previousButton = new ButtonBuilder()
    .setCustomId('previous-button')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('➡')


}