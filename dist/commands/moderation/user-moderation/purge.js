"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete a number of messages')
    .addIntegerOption((option) => option.setName('message-no').setDescription('No of message to bulk delete').setMinValue(1).setMaxValue(100).setRequired(true))
    .setDMPermission(false);
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const purgeNo = interaction.options.getInteger('message-no');
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageMessages)) {
        return await interaction.reply({
            content: '`Administrator(s)` permissions are required to use this command',
            ephemeral: true
        });
    }
    if (!purgeNo) {
        return await interaction.reply({
            content: 'Invalid Purge No',
            ephemeral: true,
        });
    }
    try {
        await interaction?.channel?.bulkDelete(purgeNo).then(async () => {
            return await interaction.reply({
                content: `Deleted ${purgeNo} messages`,
                ephemeral: true
            });
        });
    }
    catch (e) {
        await interaction.reply({
            content: "Not able to delete the messages, make sure i have right permissions",
            ephemeral: true,
        });
        console.error(`Error in ${__filename} \n ${e}`);
        return;
    }
}
exports.run = run;
