"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const triggerConfig_1 = __importDefault(require("../../../models/misc/tags/triggerConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("delete-trigger")
    .setDescription("delete a trigger for the guild")
    .addStringOption((option) => option
    .setName("trigger-name")
    .setDescription("The name of the trigger, case sensitive")
    .setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You dont have `Moderate Member(s)` powers to execute this command',
            ephemeral: true,
        });
    }
    const guildTriggersConfig = await triggerConfig_1.default.findOne({
        guildId: interaction.guild.id
    });
    if (!guildTriggersConfig) {
        return await interaction.reply({
            content: 'No triggers has been found for the guild \n create a trigger using `/create-trigger`',
            ephemeral: true,
        });
    }
    const triggerName = interaction.options.getString("trigger-name");
    const isTriggerCreated = await triggerConfig_1.default.findOne({
        triggerName: triggerName,
    });
    if (!isTriggerCreated) {
        return await interaction.reply({
            content: 'No trigger found for that name, \n **Triggers are case sensitive**',
            ephemeral: true
        });
    }
    const contents = isTriggerCreated.triggerContent;
    if (!contents)
        return;
    try {
        await triggerConfig_1.default.deleteMany({
            triggerName: triggerName,
            guildId: interaction.guild.id
        }).then(async () => {
            return await interaction.reply({
                content: `${triggerName} Has been delete from this guild`,
                ephemeral: true
            });
        }).catch(async (e) => {
            console.error(e);
            return await interaction.reply({
                content: 'DB Error, Try again later',
                ephemeral: true,
            });
        });
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
        return await interaction.reply({
            content: `Error while deleting the trigger, try again later`,
            ephemeral: true
        });
    }
}
exports.run = run;
