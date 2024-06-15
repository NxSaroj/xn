"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logsConfig_1 = __importDefault(require("../../models/moderation/logs/logsConfig"));
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    run: async (guildMember) => {
        const guildConfig = await logsConfig_1.default.findOne({ guildId: guildMember.guild.id });
        if (!guildConfig)
            return;
        if (!guildConfig.welcomeLog)
            return;
        const channel = guildMember.guild.channels.cache.get(guildConfig.channelId);
        if (!channel)
            return;
        const guildMemberAdd = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: guildMember.user.username,
            iconURL: guildMember.displayAvatarURL({ size: 256 }),
        })
            .setDescription(`**Member joined** \n\n > **Member** <:xn_arrow:1206238725130952755> ${guildMember.user.username} \n > **Member Count** <:xn_arrow:1206238725130952755> ${guildMember.guild.memberCount} \n\n`)
            .setColor("White");
        try {
            if (!channel.isTextBased())
                return;
            await channel.send({
                embeds: [guildMemberAdd]
            });
            return;
        }
        catch (err) {
            console.error(__filename, err);
        }
    }
};
