"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
const suggestionConfig_1 = __importDefault(require("../../../models/misc/suggestionConfig"));
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    run: async (interaction) => {
        if (!interaction.inCachedGuild())
            return;
        if (!interaction.isModalSubmit())
            return;
        if (interaction.customId == "suggestion-modal") {
            const isSuggestionConfigured = await guildConfig_1.default.findOne({
                guildId: interaction.guild.id,
            });
            const suggestion = interaction.fields.getTextInputValue("suggestion-content");
            try {
                const targetChannel = interaction.guild.channels.cache.get(isSuggestionConfigured?.channelId);
                const newSuggestion = new suggestionConfig_1.default({
                    guildId: interaction.guild.id,
                    authorId: interaction.user.id,
                    messageId: "", // This will be updated later
                    content: suggestion,
                });
                await newSuggestion.save();
                const suggestionEmbed = new discord_js_1.EmbedBuilder()
                    .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ size: 256 }),
                })
                    .addFields({ name: "Suggestion", value: suggestion }, { name: "Status", value: "Pending" })
                    .setColor("White");
                const approveButton = new discord_js_1.ButtonBuilder()
                    .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`)
                    .setEmoji("1209742516832706642")
                    .setLabel("Approve")
                    .setStyle(discord_js_1.ButtonStyle.Success);
                const rejectButton = new discord_js_1.ButtonBuilder()
                    .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`)
                    .setEmoji("1211166597297733713")
                    .setLabel("Reject")
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const row = new discord_js_1.ActionRowBuilder().addComponents(approveButton, rejectButton);
                try {
                    await interaction.reply({
                        content: "Thanks, Your suggestion has been created for the guild",
                    });
                    if (!targetChannel?.isTextBased())
                        return;
                    const suggestionMessage = await targetChannel.send({
                        content: "",
                        embeds: [suggestionEmbed],
                        components: [row],
                    });
                    newSuggestion.messageId = suggestionMessage.id;
                    await newSuggestion.save();
                }
                catch (err) {
                    console.error(`Error in ${__filename} \n ${err}`);
                    return;
                }
            }
            catch (err) {
                console.error(`Error in ${__filename} \n ${err}`);
                return;
            }
        }
    },
};
