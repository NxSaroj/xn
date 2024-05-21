import { Events } from 'discord.js'
import stickyConfig from '../../models/premium/stickyConfig'

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(guildMember: import('discord.js').GuildMember) {
        const isStickyConfigured = await stickyConfig.findOne({
            guildId: guildMember.guild.id
        });

        if (!isStickyConfigured) return;

        try {
            const stickyRoles = await stickyConfig.findOne({
                guildId: guildMember.guild.id,
                userId: guildMember.id,
            });

            if (!stickyRoles) return;

            const roles = stickyRoles.roles;
            const roleObjects = roles.map(roleId => guildMember.guild.roles.cache.get(roleId)).filter(role => role !== undefined && role !== null);
            await guildMember.roles.add(roleObjects).then(async()=>{
                await stickyConfig.deleteMany({
                    guildId: guildMember.guild.id,
                    userId: guildMember.id,
                }).catch(()=>{
                    console.error('DB Error, Try to connect with mongoDB')
                    return;
                })
            }).catch(async (e) => {
                console.error(e);
            });
        } catch (e) {
            
            return;
        }
    }
};