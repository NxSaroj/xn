"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('censor-punishment')
    .setDescription('Change the censor punishment')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const punishmentMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('censor-punishment-menu')
        .setPlaceholder('Select the censor punishment')
        .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Timeout')
        .setDescription('Set censor punishment to timeout')
        .setValue('timeout'), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Kick')
        .setDescription('Set censor punishment to kick')
        .setValue('kick'), new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel('Ban')
        .setDescription('Set censor punishment to ban')
        .setValue('ban'));
    const isCensorEnabled = await censorConfig_1.default.findOne({
        guildId: interaction.guild.id
    }).catch(async (e) => {
        console.error(e);
        return await interaction.reply({
            content: 'Hey, its looks like some error occured, try again later',
            ephemeral: true
        });
    });
    if (!isCensorEnabled) {
        return await interaction.reply({
            content: 'Please first add censor words using `/add-censor-words`',
            ephemeral: true
        });
    }
    const row = new discord_js_1.ActionRowBuilder().addComponents(punishmentMenu);
    const response = await interaction.reply({
        content: 'Configure censor punishments below',
        components: [row]
    });
    const collectorFilter = (i) => i.user.id == interaction.user.id;
    const collector = response.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.StringSelect,
        filter: collectorFilter,
        time: 120000,
    });
    collector.on('collect', async (i) => {
        switch (i.values[0]) {
            case 'timeout':
                await censorConfig_1.default.updateOne({
                    guildId: interaction.guild.id,
                    censorPunishment: 'Timeout'
                }).then(async () => {
                    await i.reply({
                        content: 'Changed the censor punishment',
                        ephemeral: true
                    });
                    return;
                }).catch(async (e) => {
                    console.error(e);
                    await i.reply({
                        content: 'DB Error, try again later',
                        ephemeral: true
                    });
                });
                break;
            case 'kick':
                await censorConfig_1.default.updateOne({
                    guildId: interaction.guild.id,
                    censorPunishment: 'Kick'
                }).then(async () => {
                    return await i.reply({
                        content: 'Punishment changed to kick',
                        ephemeral: true
                    });
                }).catch(async (e) => {
                    console.error(e);
                    await i.reply({
                        content: 'DB Error, try again later',
                        ephemeral: true
                    });
                    return;
                });
                break;
            case 'ban':
                await censorConfig_1.default.updateOne({
                    guildId: interaction.guild.id,
                    censorPunishment: 'Ban'
                }).then(async () => {
                    return await i.reply({
                        content: 'Punishment changed to ban',
                        ephemeral: true
                    });
                }).catch(async (e) => {
                    console.error(e);
                    await i.reply({
                        content: 'DB Error, try again later',
                        ephemeral: true
                    });
                    return;
                });
                break;
        }
    });
}
exports.run = run;
