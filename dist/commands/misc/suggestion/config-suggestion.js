"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../models/misc/guildConfig"));
const suggestion_row_1 = require("../../../utilities/buttons/suggestion-row");
const config_json_1 = require("../../../utilities/json/config.json");
exports.data = {
    name: "config-suggestion",
    description: "Customize the suggestion module for the guild",
    dm_permission: false
};
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    try {
        if (!interaction.memberPermissions.has("Administrator")) {
            return await interaction.reply({
                content: "You need `Adminstrator` permission to execute this command",
            });
        }
        const isSuggestionConfigured = await guildConfig_1.default.findOne({
            guildId: interaction.guild.id,
        });
        let suggestionStatus = config_json_1.emojis.xn_wrong;
        if (isSuggestionConfigured)
            suggestionStatus = config_json_1.emojis.xn_tick;
        const response = await interaction.reply({
            embeds: [{
                    title: 'Customize Embed Module',
                    thumbnail: interaction.guild.iconURL(),
                    color: 0xff000,
                    fields: [
                        {
                            name: "Enabled",
                            value: suggestionStatus,
                        },
                        {
                            name: "Suggestion Channel",
                            value: interaction.guild.channels.cache.get(isSuggestionConfigured?.channelId) || "`Not set`",
                        },
                        {
                            name: "Suggestion Role",
                            value: isSuggestionConfigured?.roleId || "`Not set`",
                        }
                    ]
                }],
            components: [suggestion_row_1.suggestionRow],
        });
        const collector = response.createMessageComponentCollector({
            time: 60000,
            componentType: discord_js_1.ComponentType.StringSelect,
            filter: (i) => i.user.id == interaction.user.id,
        });
        collector.on("collect", async (i) => {
            switch (i.values[0]) {
                case "suggestion-role":
                    await i.deferReply({ ephemeral: true });
                    await i.editReply(`Enter the role **Id** in chat`);
                    const messageCollector = interaction.channel?.createMessageCollector({
                        time: 6000,
                        filter: (message) => message.author.id == i.user.id,
                    });
                    messageCollector?.on("collect", async (message) => {
                        const roleId = message.content;
                        const role = interaction.guild.roles.cache.get(roleId);
                        if (!role) {
                            return await i.followUp({
                                content: "Invalid role Id, Try again",
                                ephemeral: true,
                            });
                        }
                        await isSuggestionConfigured?.updateMany({
                            guildId: interaction.guild.id,
                            roleId: roleId,
                        });
                        await isSuggestionConfigured?.save().catch(async (err) => {
                            console.error(err);
                            await i.followUp({
                                content: "DB Error, Try Again Later",
                                ephemeral: true,
                            });
                            return;
                        });
                        await i.followUp({
                            content: `${role} Has configured as suggestion role, YaY`,
                            ephemeral: true,
                        });
                    });
                    break;
                case "suggestion-channel":
                    await i.deferReply({ ephemeral: true });
                    const configExist = await guildConfig_1.default.findOne({
                        guildId: interaction.guildId,
                    });
                    if (configExist) {
                        await guildConfig_1.default.deleteMany({ guildId: interaction.guild.id });
                        await i.editReply(`Disabled The Suggestion System`);
                    }
                    else {
                        await i.followUp({
                            content: "Enter the channel **Id** in chat",
                            ephemeral: true,
                        });
                        const collector = interaction.channel?.createMessageCollector({
                            time: 60000,
                            filter: (message) => message.author.id == i.user.id,
                        });
                        collector?.on("collect", async (message) => {
                            const channelId = message.content;
                            collector.stop();
                            const cachedChannel = interaction.guild.channels.cache.get(channelId);
                            if (!cachedChannel)
                                return await i.followUp({
                                    content: "Enter a valid channel Id",
                                    ephemeral: true,
                                });
                            await guildConfig_1.default.create({
                                guildId: interaction.guild.id,
                                channelId: channelId,
                            });
                            await i.followUp({
                                content: `Added ${cachedChannel} As suggestion channel`,
                                ephemeral: true,
                            });
                        });
                    }
                    break;
            }
        });
    }
    catch (error) {
        console.error(`Error in ${__dirname} \n ${error}`);
        return;
    }
}
exports.run = run;
