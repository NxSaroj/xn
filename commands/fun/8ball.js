const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Play 8ball with xantrack')
    .addStringOption((option)=>option.setName('question').setDescription('Question you want to ask').setRequired(true))
    .setDMPermission(false),
    run: async ({ interaction }) => {
        const question = interaction.options.getString('question')
        const response = [
            'Yes',
            'Never',
            'You Really Think? Lmao',
            'For Sure',
            'In Your Dreams',
            'Better',
            'Dumb Question',
            'Ask Again Later',
            '100%',
            '-99', 
            'Less then your iq', 
            'No', 
            'Amazing', 
            'Awesome',
            'Here we go again', 
            'LOL'
            
        ]

        const randomResponse = response[Math.floor(Math.random() * response.length)];
        const responseEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 })})
        .setDescription(`**Question** <:xn_arrow:1207610123778920448> ${question} \n\n **Answer** \<:xn_arrow:1207610123778920448> ${randomResponse}`)
        .setColor('White')

        try {
            await interaction.reply({
                embeds: [responseEmbed]
            })
            return;
        } catch (err) {
            console.error(`Error in ${__filename} \n ${e}`)
            return
        }

    },

}