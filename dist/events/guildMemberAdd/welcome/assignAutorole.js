"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const autoroleConfig_1 = __importDefault(require("../../../models/misc/autoroleConfig"));
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    run: async (guildMember) => {
        if (!guildMember.guild)
            return;
        const isConfigured = await autoroleConfig_1.default.findOne({ guildId: guildMember.guild.id });
        if (!isConfigured)
            return;
        const autoRole = isConfigured.roleId;
        if (!autoRole) {
            await autoroleConfig_1.default.deleteMany({ guildId: guildMember.guild.id });
            return;
        }
        const guildAutoRole = guildMember.guild.roles.cache.get(autoRole);
        if (!guildAutoRole) {
            await autoroleConfig_1.default.deleteMany({ guildId: guildMember.guild.id });
            return;
        }
        try {
            await guildMember.roles.add(autoRole);
        }
        catch (err) {
            console.error(`Error in ${__filename} \n ${err}`);
            return;
        }
    }
};
