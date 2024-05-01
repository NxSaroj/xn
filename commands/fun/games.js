/**
 * @param {import('commandkit').SlashCommandProps} interaction
 */
const { RockPaperScissors, TicTacToe } = require('discord-gamecord')
const { ApplicationCommandOptionType, StringSelectMenuBuilder,  ActionRowBuilder ,StringSelectMenuOptionBuilder } = require('discord.js')
module.exports = {
    data: {
        name: 'start-minigame', 
        description: 'Bored? Play some mingames then',
        dm_permission: false
    }, 
    run: async ({ interaction }) => {
        const gameMenu = new StringSelectMenuBuilder()
			.setCustomId('gameMenu')
			.setPlaceholder('Try any game')
            .addOptions(
                new StringSelectMenuOptionBuilder()
					.setLabel('Tic-Tac-Toe')
					.setDescription('Why not? Play tic tac toe with your friend')
					.setValue('ttt'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Rock-Paper-Scissors')
					.setDescription('Why not? Play rps with your friend')
					.setValue('rps'),
            )

            const row = new ActionRowBuilder().addComponents(gameMenu)
            const reply = await interaction.reply({
                content: "It's MiniGame Time", 
                components: [row]
            })
            
            
    }, 
    options: {
        devOnly: true
    }
}