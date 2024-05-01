const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const censorConfig = require("../../../models/moderation/automod/censorConfig");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('censor-remove')
    .setDescription('Remove a censor word from the guild')
    .addStringOption((option)=>option.setName('word').setDescription('Enter the word to remove CASE SENSITIVE').setRequired(true))
    .setDMPermission(false),
    run: async ({ interaction }) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({
                content: 'You need to have `Moderate Member(s)` permissions to execute this command',
                ephemeral: true
            })
        }

        const isCensorEnabled = await censorConfig.findOne({
            guildId: interaction.guild.id,
        })

        const word = interaction.options.getString('word')

        if (!isCensorEnabled) {
            return await interaction.reply({
                content: 'Censor system has not been configured for the server',
                ephemeral: true,
            })
        } 
        
        const censorWords = isCensorEnabled.censorWords
        if (!censorWords.includes(word)) {
            return await interaction.reply({
                content: `That word is not present in the censor list`,
                ephemeral: true
            })
        } else {
            await censorConfig.findOneAndDelete({
                censorWords: word,
            }).then(async()=>{
                return await interaction.reply({
                    content: 'Deleted that word from censor list',
                    ephemeral: true
                })
            }).catch(async(e)=>{
                console.error(`Error: ${e}`)
                await interaction.reply({
                    content: 'DB Error, try again later',
                    ephemeral: true
                })
                return;
            })
        }


    },

  
}