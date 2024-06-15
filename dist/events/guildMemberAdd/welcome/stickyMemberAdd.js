"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const stickyConfig_1 = __importDefault(require("../../../models/premium/stickyConfig"));
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    async run(guildMember) {
        const isStickyConfigured = await stickyConfig_1.default.findOne({
            guildId: guildMember.guild.id
        });
        if (!isStickyConfigured)
            return;
        try {
            const stickyRoles = await stickyConfig_1.default.findOne({
                guildId: guildMember.guild.id,
                userId: guildMember.id,
            });
            if (!stickyRoles)
                return;
            const roles = stickyRoles.roles;
            const roleObjects = roles.map(roleId => guildMember.guild.roles.cache.get(roleId)).filter(role => role !== undefined && role !== null);
            await guildMember.roles.add(roleObjects).then(async () => {
                await stickyConfig_1.default.deleteMany({
                    guildId: guildMember.guild.id,
                    userId: guildMember.id,
                }).catch(() => {
                    console.error('DB Error, Try to connect with mongoDB');
                    return;
                });
            }).catch(async (e) => {
                console.error(e);
            });
        }
        catch (e) {
            return;
        }
    }
};
