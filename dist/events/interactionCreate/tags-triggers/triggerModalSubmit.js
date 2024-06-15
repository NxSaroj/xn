"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const triggerConfig_1 = __importDefault(require("../../../models/misc/tags/triggerConfig"));
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    run: async (interaction) => {
        if (!interaction.inCachedGuild())
            return;
        if (!interaction.isModalSubmit())
            return;
        if (interaction.customId == "trigger-modal") {
            const nameInput = interaction.fields.getTextInputValue("trigger-name");
            const contentInput = interaction.fields.getTextInputValue("trigger-content");
            const isTriggerCreated = await triggerConfig_1.default.findOne({
                triggerName: nameInput,
                guildId: interaction.guild.id,
            });
            if (isTriggerCreated) {
                try {
                    await triggerConfig_1.default
                        .findOneAndUpdate({ triggerName: nameInput, guildId: interaction.guild.id }, { triggerContent: contentInput }, { upsert: false })
                        .then(async () => {
                        return await interaction.reply({
                            content: `${nameInput} Trigger has been updated`,
                        });
                    });
                }
                catch (e) {
                    console.error(`Error in file ${__filename} \n ${e}`);
                    return await interaction.reply({
                        content: "Error while updating trigger",
                        ephemeral: true,
                    });
                }
            }
            else {
                try {
                    await triggerConfig_1.default
                        .create({
                        triggerName: nameInput,
                        triggerContent: contentInput,
                        guildId: interaction.guild.id,
                    })
                        .then(async () => {
                        return await interaction.reply({
                            content: `${nameInput} Trigger has been created`,
                            ephemeral: true,
                        });
                    });
                }
                catch (e) {
                    console.error(`Error in ${__filename} \n ${e}`);
                }
            }
        }
    }
};
