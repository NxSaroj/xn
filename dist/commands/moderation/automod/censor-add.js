"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('add-censor-words')
    .setDescription('Add censor words for the guild')
    .addStringOption((option) => option.setName('word-1').setDescription('The first word').setRequired(true))
    .addStringOption((option) => option.setName('word-2').setDescription('The second word'))
    .addStringOption((option) => option.setName('word-3').setDescription('The third word'))
    .addStringOption((option) => option.setName('word-4').setDescription('The fourth word'))
    .addStringOption((option) => option.setName('word-5').setDescription('The fifth word'))
    .addStringOption((option) => option.setName('word-6').setDescription('The sixth word'))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You need to have `Administator(s)` permissions to execute this command',
            ephemeral: true
        });
    }
    const isCensorEnabled = await censorConfig_1.default.findOne({
        guildId: interaction.guild.id
    });
    const word1 = interaction.options.getString('word-1');
    const word2 = interaction.options.getString('word-2');
    const word3 = interaction.options.getString('word-3');
    const word4 = interaction.options.getString('word-4');
    const word5 = interaction.options.getString('word-5');
    const word6 = interaction.options.getString('word-6');
    const words = [word1, word2, word3, word4, word5, word6].filter(word => word !== null && word !== undefined);
    if (isCensorEnabled) {
        const censorList = isCensorEnabled.censorWords;
        const exist = await censorConfig_1.default.findOne({
            censorWords: words,
        });
        if (censorList.length >= 6) {
            return await interaction.reply({
                content: `The censor word limit has been reached for the server`,
                ephemeral: true,
            });
        }
        else if (exist) {
            await interaction.reply({
                content: 'One of the words in options is already available in censor list \n recheck all censor words using `/censor-list`',
                ephemeral: true
            });
        }
        else {
            await censorConfig_1.default.findOneAndUpdate({
                guildId: interaction.guild.id,
                censorWords: words,
            }).then(async () => {
                const censorEmbed = new discord_js_1.EmbedBuilder()
                    .setDescription(`**${words.length}** Has been added to censor list`)
                    .setColor('White');
                console.log(words);
                return await interaction.reply({
                    embeds: [censorEmbed]
                });
            }).catch(async (e) => {
                console.error(`Error: ${e}`);
                await interaction.reply({
                    content: `DB Error, Try again later`
                });
            });
        }
    }
    else {
        await censorConfig_1.default.create({
            guildId: interaction.guild.id,
            censorWords: words,
        }).then(async () => {
            const censorEmbed = new discord_js_1.EmbedBuilder()
                .setDescription(`**${words.length}** Has been added to censor list`)
                .setColor('White');
            console.log(words);
            return await interaction.reply({
                embeds: [censorEmbed]
            });
        }).catch(async (e) => {
            console.error(`Error: ${e}`);
            await interaction.reply({
                content: `DB Error, Try again later`
            });
        });
    }
}
exports.run = run;
