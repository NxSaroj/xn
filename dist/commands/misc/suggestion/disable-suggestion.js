"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("disable-suggestion")
    .setDescription("Disable the suggestion settings for the guild")
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
            content: "You need `Manage Channel(s)` permissions to execute this command",
            ephemeral: true,
        });
    }
    const isSuggestionEnabled = await guildConfig_1.default.exists({
        guildId: interaction.guild.id,
    });
    if (!isSuggestionEnabled) {
        return await interaction.reply({
            content: "You can't disable suggestion in this server, as it has not been configured",
            ephemeral: true,
        });
    }
    try {
        await guildConfig_1.default
            .deleteMany({
            guildId: interaction.guild.id,
        })
            .then(async () => {
            await interaction.reply({
                content: "Disabled the suggestion system for the server",
            });
        })
            .catch(async (e) => {
            console.error(e);
            await interaction.reply({
                content: "Error while disabling suggestion, Try again later",
                ephemeral: true,
            });
            return;
        });
    }
    catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        await interaction.reply({
            content: "Error while disabling suggestion, Try again later",
            ephemeral: true,
        });
        return;
    }
}
