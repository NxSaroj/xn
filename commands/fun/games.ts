/**
 * @param {import('commandkit').SlashCommandProps} interaction
 */
import { CommandData, SlashCommandProps } from 'commandkit'
/**import { RockPaperScissors, TicTacToe } from 'discord-gamecord' || Types PROB**/
import { ApplicationCommandOptionType, StringSelectMenuBuilder,  ActionRowBuilder ,StringSelectMenuOptionBuilder } from 'discord.js'

export const data:CommandData = {
    name: 'start-minigame', 
        description: 'Bored? Play some mingames then',
        dm_permission: false
}

export async function run ({ interaction }: SlashCommandProps) {
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

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(gameMenu)
    const reply = await interaction.reply({
        content: "It's MiniGame Time", 
        components: [row]
    })
    
    
}