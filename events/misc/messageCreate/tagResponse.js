const { Events } = require('discord.js');
const tagConfig = require('../../../models/misc/tags/tagConfig')
module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {import('discord.js').Message} message 
     * @returns 
     */
    async execute(message) {
        const isTagExist = await tagConfig.findOne({
            guildId: message.guild.id
        })
        if (!isTagExist) return
        const tagName = isTagExist?.tagName
        if (message.content.startsWith(`x!${tagName}`)) {
            return message.reply()
        }
    }
}