import { Events } from 'discord.js'
import stickyConfig from '../../models/premium/stickyConfig'

export default {
    name: Events.GuildMemberRemove,
    async execute(guildMember:any) {
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
