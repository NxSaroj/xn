import { Events, type Message } from 'discord.js'
import guildConfig from '../../models/misc/guildConfig';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (!message.inGuild()) return;
        const isSuggestionEnabled = await guildConfig.findOne({
            guildId: message.guild.id
        }).catch((e)=>{
            return console.error(e)
        })
        if (!isSuggestionEnabled) return;
        const suggestionChannel = isSuggestionEnabled.channelId
        try {
            if (message.channelId === suggestionChannel) {
                if (message.author.bot) return;
                setTimeout(async()=>{
                    await message.delete().catch(()=>{
                        return;
                    })
                }, 2_000)
            }
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            return;
        }

    }
}