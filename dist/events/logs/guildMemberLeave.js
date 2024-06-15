"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logsConfig_1 = __importDefault(require("../../models/moderation/logs/logsConfig"));
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.GuildMemberRemove,
    run: async (guildMember) => {
        const guildConfig = await logsConfig_1.default.findOne({ guildId: guildMember.guild.id });
        if (!guildConfig)
            return;
        if (guildConfig.welcomeLog == false)
            return;
        const channel = guildMember.guild.channels.cache.get(guildConfig.channelId);
        if (!channel)
            return await logsConfig_1.default.deleteMany({ guildId: guildMember.guild.id });
        const guildMemberLeave = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: guildMember.user.username,
            iconURL: guildMember.displayAvatarURL({ size: 256 }),
        })
            .setDescription(`**Member leaved** \n\n > **Member** <:xn_arrow:1206238725130952755> ${guildMember.user.username} \n > **Member Count** <:xn_arrow:1206238725130952755> ${guildMember.guild.memberCount} \n\n`)
            .setColor("White");
        try {
            if (!channel.isTextBased())
                return;
            await channel.send({
                embeds: [guildMemberLeave]
            });
            return;
        }
        catch (err) {
            console.error(__filename, err);
        }
    }
};
