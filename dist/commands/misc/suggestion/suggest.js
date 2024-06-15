"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest anything in the guild')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const isSuggestionEnabled = await guildConfig_1.default.exists({
        guildId: interaction.guild.id
    });
    if (!isSuggestionEnabled) {
        return await interaction.reply({
            content: "You can't create suggestion in this server, as it has not been configured",
            ephemeral: true
        });
    }
    const suggestionModal = new discord_js_1.ModalBuilder()
        .setCustomId('suggestion-modal')
        .setTitle('Suggestion Area');
    const suggestionContentInput = new discord_js_1.TextInputBuilder()
        .setCustomId('suggestion-content')
        .setLabel('Enter your suggestion')
        .setPlaceholder('Type your suggestion here')
        .setMaxLength(820)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const row = new discord_js_1.ActionRowBuilder().addComponents(suggestionContentInput);
    suggestionModal.addComponents(row);
    try {
        await interaction.showModal(suggestionModal);
    }
    catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        await interaction.reply({
            content: 'Error camed, try again later',
            ephemeral: true
        });
        return;
    }
}
exports.run = run;
