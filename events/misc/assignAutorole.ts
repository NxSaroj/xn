import { Events } from 'discord.js'
import type { GuildMember } from 'discord.js'
import autoroleConfig from '../../models/misc/autoroleConfig'

export default {
    name: Events.GuildMemberAdd,
    async execute(guildMember: GuildMember) {
        if (!guildMember.guild) return
        const isConfigured = await autoroleConfig.findOne({ guildId: guildMember.guild.id })
       if (!isConfigured) return;
        const autoRole = isConfigured.roleId
        if (!autoRole) {
            await autoroleConfig.deleteMany({ guildId: guildMember.guild.id })
            return;
        }
        const guildAutoRole = guildMember.guild.roles.cache.get(autoRole)
        if (!guildAutoRole) {
            await autoroleConfig.deleteMany({ guildId: guildMember.guild.id })
            return
        }
        
      
        try {
            await guildMember.roles.add(autoRole)
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            return;
        }
    }
}