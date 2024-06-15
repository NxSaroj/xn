"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const youtubeConfig_1 = __importDefault(require("../../../models/premium/youtubeConfig"));
exports.data = {
    name: "disable-youtube",
    description: "Disable the notification settings for youtube",
    dm_permission: false,
};
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({
            content: "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
            ephemeral: true,
        });
    }
    const isYoutubeConfigured = await youtubeConfig_1.default
        .exists({
        guildId: interaction.guild.id,
    })
        .catch((err) => {
        return console.error(`Error in ${__filename} \n ${err}`);
    });
    if (!isYoutubeConfigured) {
        return await interaction.reply({
            content: "Nothing Changed, As No Youtube Channel Is Configured",
            ephemeral: true,
        });
    }
    await youtubeConfig_1.default
        .deleteMany({
        guildId: interaction.guild.id,
    })
        .then(async () => {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("White")
            .setDescription(`<:xn_tick:1209742516832706642> Youtube Notification Configration System Has Been Disabled`);
        await interaction.reply({
            embeds: [embed],
        });
    })
        .catch(async (err) => {
        console.error(err);
        await interaction.reply({
            content: "DB Error, Try Again Later",
            ephemeral: true,
        });
        return;
    });
}
exports.run = run;
