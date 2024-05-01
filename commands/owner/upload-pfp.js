const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('upload-pfp')
    .setDescription('Upload a pfp for the bot | OWNER ONLY')
    .addStringOption((option)=>option.setName('pfp').setDescription('PFP For the bot').setRequired(true))
    .setDMPermission(false),
    run: async ({ interaction, client }) => {
        if (interaction.user.id !== '1129393606432661575') {
            return await interaction.reply({
                content: 'This command is owner exclusive',
                ephemeral: true,
            })
        }

        await interaction.deferReply({
            ephemeral: true
        })

        const pfp = interaction.options.getString('pfp')

        try {
              
            client.user.setAvatar(pfp).then(async()=>{
                return await interaction.editReply({
                    content: 'Uploaded the pfp'
                })
            }).catch(async(e)=>{
                const embed = new EmbedBuilder()
                .setDescription(`**Uff an error camed** \n\n ||${e}||`)
                .setColor('White')
                await interaction.editReply({
                    embeds: [embed]
                })
                return;
            })

        } catch (e) {
            console.error(e)
            const embed = new EmbedBuilder()
            .setDescription(`**Uff an error camed** \n\n ||${e}||`)
            .setColor('White')
            await interaction.editReply({
                embeds: [embed]
            })
            return;
        }

    },

    options: {
        devOnly: true,
    }
}