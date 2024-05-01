  const { Events, GuildMember } = require('discord.js')
const autoroleConfig = require('../../models/misc/autoroleConfig');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} guildMember 
     * @returns 
     */
    async execute(guildMember) {
        const isConfigured = await autoroleConfig.findOne({ guildId: guildMember.guild.id })
       if (!isConfigured) return;
        const autoRole = isConfigured.roleId
        const guildAutoRole = guildMember.guild.roles.cache.get(autoRole)
        if (!autoRole) {
            await autoroleConfig.deleteMany({ guildId: guildMember.guild.id })
        }
        if (!guildAutoRole) {
            await autoroleConfig.deleteMany({ guildId: guildMember.guild.id })
        }
      
        try {
            await guildMember.roles.add(autoRole)
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            return;
        }
    }
}