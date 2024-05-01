const { Events } = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        if (!interaction.inGuild()) {
            return await interaction.reply({
                content: "This command can only be used in guilds",
                ephemeral: true
            }).catch(err => { return; })
        }
    }
}