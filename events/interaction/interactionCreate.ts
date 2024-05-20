const { Events } = require('discord.js');
module.exports = {

    async execute(interaction: import('discord.js').ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            return await interaction.reply({
                content: "This command can only be used in guilds",
                ephemeral: true
            }).catch(err => { return; })
        }
    }
}