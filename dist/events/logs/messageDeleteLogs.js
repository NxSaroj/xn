"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logsConfig_1 = __importDefault(require("../../models/moderation/logs/logsConfig"));
exports.default = {
    name: discord_js_1.Events.MessageDelete,
    run: async (message) => {
        if (!message.inGuild())
            return;
        const guildConfig = await logsConfig_1.default.findOne({ guildId: message?.guild?.id });
        if (!guildConfig)
            return;
        if (guildConfig.messageLog == false)
            return;
        const channel = message.guild.channels.cache.get(guildConfig?.channelId);
        if (!channel)
            return logsConfig_1.default.deleteMany({ guildId: message.guildId });
        if (!channel.isTextBased())
            return;
        if (message.author.bot)
            return;
        const messageDeleteEmbed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ size: 256 }),
        })
            .setDescription(`**Message Deleted** \n\n > **Message Content** <:xn_arrow:1206238725130952755> ${message.content} \n > **Message Author** <:xn_arrow:1206238725130952755> ${message.author.tag} \n > **Message Channel** <:xn_arrow:1206238725130952755> <#${message.channelId}>\n\n`)
            .setColor("White");
        try {
            await channel.send({
                embeds: [messageDeleteEmbed],
            });
            return;
        }
        catch (e) {
            console.log(`Error in ${__filename} \n ${e}`);
            return;
        }
    }
};
