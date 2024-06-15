"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logsConfig_1 = __importDefault(require("../../models/moderation/logs/logsConfig"));
exports.default = {
    name: discord_js_1.Events.ChannelDelete,
    run: async (channels) => {
        const guildConfig = await logsConfig_1.default.findOne({ guildId: channels.guild.id });
        if (!guildConfig)
            return;
        if (!guildConfig.channelLog)
            return;
        const channel = channels.guild.channels.cache.get(guildConfig?.channelId);
        if (!channel)
            return;
        const channelDeletion = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: channels.guild.name,
            iconURL: channels.guild.iconURL()
        })
            .setDescription(`**Channel Deleted** \n\n > **Channel** <:xn_arrow:1206238725130952755> ${channels.name} `)
            .setColor("White");
        try {
            await channel.send({
                embeds: [channelDeletion]
            });
            return;
        }
        catch (err) {
            console.error(__filename, err);
        }
    }
};
