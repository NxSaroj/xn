"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.data = {
    name: "censor-remove",
    description: "remove a censor word from automod",
    options: [
        {
            name: "word",
            description: "The censored word to remove",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    dm_permission: false,
};
async function run({ interaction }) {
    if (!interaction.guild)
        return;
    if (!interaction.member)
        return;
    if (!interaction.memberPermissions?.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
        await interaction.reply({
            content: "You need to have `Moderate Member(s)` permissions to execute this command",
            ephemeral: true,
        });
        return;
    }
    const isCensorEnabled = await censorConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    const word = interaction.options.getString("word") || "";
    if (!isCensorEnabled) {
        await interaction.reply({
            content: "Censor system has not been configured for the server",
            ephemeral: true,
        });
        return;
    }
    const censorWords = isCensorEnabled.censorWords;
    if (!censorWords.includes(word)) {
        await interaction.reply({
            content: "That word is not in censorList",
            ephemeral: true
        });
        return;
    }
    censorConfig_1.default
        .findOneAndDelete({
        censorWords: word,
    })
        .then(() => {
        interaction.reply({
            content: "Deleted that word from censor list",
            ephemeral: true,
        });
        return;
    })
        .catch((e) => {
        console.error(`Error: ${e}`);
        interaction.reply({
            content: "DB Error, try again later",
            ephemeral: true,
        });
        return;
    });
}
exports.run = run;
