const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const censorConfig = require("../../../models/moderation/automod/censorConfig");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('censor-list')
    .setDescription('List all the censor words of the guild')
    .setDMPermission(false),
    run: async ({ interaction }) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({
                content: 'You need to have `Moderate Member(s)` permissions to execute this command',
                ephemeral: true
            })
        }


        const isCensorSetup = await censorConfig.findOne({
            guildId: interaction.guild.id
        })
        if (!isCensorSetup) {
            await interaction.reply({
                content: `The censor system has not been configured for the server`,
                ephemeral: true,

            })
            return;
        }

        const censorWords = isCensorSetup.censorWords
        if (censorWords.length === 0) {
            console.log(censorWords)
            return await interaction.reply({
                content: 'Error camed',
                ephemeral: true
            })
        }
        try {
            const censorListEmbed = new EmbedBuilder()
            .setTitle(`**Censor Words Fetched**`)
            .setDescription(censorWords.join('\n').toString())
            .setColor('White')
            await interaction.reply({
                embeds: [censorListEmbed]
            })
        } catch (e) {
            console.log(e)
            console.error(`Error in file ${__filename} \n ${e}`)
        }
    },


}