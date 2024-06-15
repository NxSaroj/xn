"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tagConfig_1 = __importDefault(require("../../../models/misc/tags/tagConfig"));
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    run: async (interaction) => {
        if (!interaction.isModalSubmit())
            return;
        if (interaction.customId == "tag-modal") {
            const tagName = interaction.fields.getTextInputValue('tag-name');
            const tagContent = interaction.fields.getTextInputValue('tag-content');
            const isTagExist = await tagConfig_1.default.findOne({
                tagName: tagName,
                tagContent: tagContent
            });
            try {
                if (isTagExist) {
                    await tagConfig_1.default.findOneAndUpdate({ tagName: tagName }, { guildId: interaction?.guild?.id }, { tagContent: tagContent });
                    await interaction.reply({
                        content: `${tagName} Has been updated`
                    });
                }
                else {
                    await tagConfig_1.default.create({
                        tagName: tagName,
                        tagContent: tagContent
                    });
                    await interaction.reply({
                        content: `${tagName} Has been created`
                    });
                }
            }
            catch (error) {
                await interaction.reply({
                    content: 'Error Occured, Try again later',
                    ephemeral: true
                });
                console.error(`Error in ${__filename} : Error \n ${error}`);
                return;
            }
        }
    }
};
