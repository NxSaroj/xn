"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
/**import { RockPaperScissors, TicTacToe } from 'discord-gamecord' || Types PROB**/
const discord_js_1 = require("discord.js");
exports.data = {
    name: 'start-minigame',
    description: 'Bored? Play some mingames then',
    dm_permission: false
};
async function run({ interaction }) {
    const gameMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('gameMenu')
        .setPlaceholder('Try any game')
        .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Tic-Tac-Toe')
        .setDescription('Why not? Play tic tac toe with your friend')
        .setValue('ttt'), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Rock-Paper-Scissors')
        .setDescription('Why not? Play rps with your friend')
        .setValue('rps'));
    const row = new discord_js_1.ActionRowBuilder().addComponents(gameMenu);
    const reply = await interaction.reply({
        content: "It's MiniGame Time",
        components: [row]
    });
}
exports.run = run;
