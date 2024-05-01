const { SlashCommandBuilder, EmbedBuilder, ActivityType, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('update-status')
    .setDescription('Update the bot status')
    .addStringOption((option)=>option.setName('visiblity').setDescription('The visiblity status: dnd, online, offline').setRequired(true))
    .addStringOption((option)=>option.setName('custom-status').setDescription('The custom text displayed in status').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    run: async ({ interaction, client }) => {

        await interaction.deferReply({
            ephemeral: true
        })

        const management = ["1129393606432661575", "750339984598368287"]

        if (!management.includes(interaction.user.id)) {
            return await interaction.editReply({
                content: "This command is owner only",
                ephemeral: true
            })
        }

        const visiblity = interaction.options.getString('visiblity')
        const custom_status = interaction.options.getString('custom-status')
        
        if (!visiblity == 'online'.toLocaleLowerCase() || !visiblity == 'dnd'.toLocaleLowerCase() || !visiblity == 'idle'.toLocaleLowerCase() || !visiblity == 'invisible'.toLocaleLowerCase()) {
            return await interaction.editReply({
                content: "Enter a valid visiblity",
                ephemeral: true
            })
        }

    

        try {
            await client.user.setStatus(visiblity);
            await client.user.setActivity(custom_status, { type: ActivityType.Listening });

            const embed = new EmbedBuilder()
            .setColor('White')
            .setDescription(`<:xn_tick:1209742516832706642> The visiblity and status has been updated`)
            await interaction.editReply({
            embeds: [embed]
        })
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            await interaction.editReply({
                content: "Error While Updating Status, Try Again Later",
                ephemeral: true
            })
            return;
        }

    }, 
    options: {
        devOnly: true
    }
}