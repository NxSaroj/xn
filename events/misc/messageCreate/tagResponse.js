const { Events } = require('discord.js');
const tagConfig = require('../../../models/misc/tags/tagConfig')
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const isTagExist = await tagConfig.findOne({
            guildId: message.guild.id
        })
        if (!isTagExist) return
        
    }
}