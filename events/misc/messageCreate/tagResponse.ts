import { Events } from 'discord.js'
import tagConfig from '../../../models/misc/tags/tagConfig'
export default {
    name: Events.MessageCreate,
    async execute(message:import('discord.js').Message) {
        if (!message.inGuild()) return;
        const isTagExist = await tagConfig.findOne({
            guildId: message.guild.id
        })
        if (!isTagExist) return
        const tagName = isTagExist?.tagName
        if (message.content.startsWith(`x!${tagName}`)) {
            return 
        }
    }
}