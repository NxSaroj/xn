const { Events } = require('discord.js');
const tagConfig = require('../../models/misc/tags/tagConfig')
module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId == "tag-modal") {
            const tagName = interaction.fields.getTextInputValue('tag-name')
            const tagContent = interaction.fields.getTextInputValue('tag-content')


            const isTagExist = await tagConfig.findOne({
                tagName: tagName,
                tagContent: tagContent
            })

            try {
                if (isTagExist) {
                    await tagConfig.findOneAndUpdate(
                        { tagName: tagName },
                        { guildId: interaction.guild.id },
                        { tagContent: tagContent }, 
                        
                    )
                    await interaction.reply({
                        content: `${tagName} Has been updated`
                    })
                } else {
                    await tagConfig.create({
                        tagName: tagName,
                        tagContent: tagContent
                    })
                    await interaction.reply({
                        content: `${tagName} Has been created`
                    })
                }
            } catch (error) {
                await interaction.reply({
                    content: 'Error Occured, Try again later', 
                    ephemeral: true
                })
                console.error(`Error in ${__filename} : Error \n ${error}`)
                return;
            }
        }
    }
}