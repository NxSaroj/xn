"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const stickyConfig_1 = __importDefault(require("../../../models/premium/stickyConfig"));
exports.default = {
    name: discord_js_1.Events.GuildMemberRemove,
    async run(guildMember) {
        const isStickyConfigured = await stickyConfig_1.default.findOne({
            guildId: guildMember.guild.id,
        });
        if (!isStickyConfigured)
            return;
        try {
            await stickyConfig_1.default.create({
                guildId: guildMember.guild.id,
                userId: guildMember.id,
                roles: guildMember.roles.cache.map((role) => role.id)
            }).catch(async (e) => {
                console.error(e);
            });
        }
        catch (e) {
            console.error(e);
            return;
        }
    }
};
