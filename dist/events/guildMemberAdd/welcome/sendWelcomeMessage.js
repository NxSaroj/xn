"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const welcomeConfig_1 = __importDefault(require("../../../models/welcome/welcomeConfig"));
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    run: async (guildMember) => {
        const guildId = guildMember.guild.id;
        const existingSetup = await welcomeConfig_1.default.findOne({ guildId: guildId });
        const welcomeConfigs = await welcomeConfig_1.default.find({
            guildId: guildMember.guild.id,
        });
        if (!existingSetup) {
            return;
        }
        if (!existingSetup.channelId)
            return;
        const targetChannel = guildMember.guild.channels.cache.get(existingSetup.channelId);
        if (!targetChannel?.isTextBased())
            return;
        for (const welcomeConfig of welcomeConfigs) {
            const customMessage = welcomeConfig.customMessage;
            if (!welcomeConfig.messageContent)
                return;
            const messageContent = welcomeConfig.messageContent
                .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
                .replace(`{target(user.username)}`, `${guildMember.user.username}`)
                .replace(`{guild.name}`, `${guildMember.guild.name}`);
            try {
                const title = customMessage[0].data.title
                    .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
                    .replace(`{target(user.username)}`, `${guildMember.user.username}`)
                    .replace(`{guild.name}`, `${guildMember.guild.name}`)
                    .replace(`{guild(memberCount)}`, `${guildMember.guild.memberCount}`);
                const description = customMessage[0].data.description
                    .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
                    .replace(`{target(user.username)}`, `${guildMember.user.username}`)
                    .replace(`{guild.name}`, `${guildMember.guild.name}`)
                    .replace(`{guild(memberCount)}`, `${guildMember.guild.memberCount}`);
                let thumbnail = customMessage[0].data.thumbnail;
                if (thumbnail == `{target(avatar)}`) {
                    thumbnail = guildMember.displayAvatarURL();
                }
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setImage(customMessage[0].data.image || null)
                    .setThumbnail(thumbnail)
                    .setColor(customMessage[0].data.color);
                targetChannel.send({ content: messageContent, embeds: [embed] });
            }
            catch (err) {
                console.error(`Error in ${__filename} \n ${err}`);
            }
        }
        if (!targetChannel) {
            console.error("error");
            return;
        }
    }
};
