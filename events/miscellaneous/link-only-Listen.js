const { Events, Message } = require('discord.js')
const linkOnlyConfig = require('../../models/misc/link-channel-config')

module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    async execute(message) {

        try {
            const isLinkOnlyEnabled = await linkOnlyConfig.findOne({
                guildId: message.guild.id
            }).catch((err)=>{ return console.error(err) })
            
            if (!isLinkOnlyEnabled) return;
            const linkOnlyChannel = isLinkOnlyEnabled.channelId
            if (!linkOnlyChannel) {
                await linkOnlyConfig.deleteMany({
                    guildId: message.guild.id
                }).catch(err => { return console.error(err) })
                return;
            }
            if (message.channelId == linkOnlyChannel) {
                if (message.content.startsWith('https://') || message.content.startsWith('http://')) return;
                setTimeout(async()=>{
                    await message.delete().catch(()=>{return})
                    await message.channel.send(`<@${message.author.id}> Only links are allowed here`)
                }, 1_000)
            }
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            return;
        }
        
    }
}