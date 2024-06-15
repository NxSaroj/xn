"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('censor-clear')
    .setDescription('Clear all the censor words of the guild')
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You need to have `Moderate Member(s)` permissions to execute this command',
            ephemeral: true
        });
    }
    const isCensorEnabled = await censorConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    if (!isCensorEnabled) {
        return await interaction.reply({
            content: `Censor system has not been configured for the guild`,
            ephemeral: true
        });
    }
    else {
        await censorConfig_1.default.deleteMany({
            guildId: interaction.guild.id
        }).then(async () => {
            return await interaction.reply({
                content: 'Deleted all the data of censor words',
                ephemeral: true
            }).catch(async (e) => {
                console.error(e);
                return await interaction.reply({
                    content: 'DB Error, try again later',
                    ephemeral: true
                });
            });
        });
    }
}
exports.run = run;
