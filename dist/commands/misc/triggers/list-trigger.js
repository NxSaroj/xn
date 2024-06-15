"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const triggerConfig_1 = __importDefault(require("../../../models/misc/tags/triggerConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('list-trigger')
    .setDescription('List all the triggers of the guild')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const triggers = await triggerConfig_1.default.find({ guildId: interaction.guild.id });
    if (!triggers || triggers.length === 0) {
        return await interaction.reply({
            content: 'No triggers found',
            ephemeral: true,
        });
    }
    const response = await interaction.reply({
        content: 'Fetching the triggers list...'
    });
    try {
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ size: 256 })
        })
            .setDescription(`**Triggers Fetched**\n\n${triggers.map((trigger) => `**${trigger.triggerName}**`).join('\n')}`)
            .setColor('White');
        return await response.edit({
            content: '',
            embeds: [embed],
        });
    }
    catch (e) {
        await interaction.reply({
            content: 'Error occured, Try again later',
            ephemeral: true,
        });
        console.log(e);
    }
}
exports.run = run;
