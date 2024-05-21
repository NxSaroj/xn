const { Events } = require('discord.js')
const stickyConfig = require('../../models/premium/stickyConfig');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(guildMember) {
        const isStickyConfigured = await stickyConfig.findOne({
            guildId: guildMember.guild.id,
        })

        if (!isStickyConfigured) return;

        try {
            await stickyConfig.create({
                guildId: guildMember.guild.id,
                userId: guildMember.id,
                roles: guildMember.roles.cache.map(role => role.id)
            }).catch(async(e)=>{
                console.error(e)
            })
        } catch (e) {
            console.error(e)
            return;
        }
    }
}
