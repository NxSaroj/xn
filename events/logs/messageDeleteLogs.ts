import { Events, EmbedBuilder, type Message } from 'discord.js'
import logsConfig from '../../models/moderation/logs/logsConfig'

export default {
  name: Events.MessageDelete,
  run: async (message: Message) => {
    if (!message.inGuild()) return
    const guildConfig = await logsConfig.findOne({ guildId: message?.guild?.id });
    if (!guildConfig) return;
    if (guildConfig.messageLog == false) return;
    const channel = message.guild.channels.cache.get(guildConfig?.channelId);
  
    if (!channel) return logsConfig.deleteMany({ guildId: message.guildId });
    if (!channel.isTextBased()) return;
  
    if (message.author.bot) return;
    const messageDeleteEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ size: 256 }),
      })
      .setDescription(
        `**Message Deleted** \n\n > **Message Content** <:xn_arrow:1206238725130952755> ${message.content} \n > **Message Author** <:xn_arrow:1206238725130952755> ${message.author.tag} \n > **Message Channel** <:xn_arrow:1206238725130952755> <#${message.channelId}>\n\n`
      )
      .setColor("White")
  
    try {
      await channel.send({
        embeds: [messageDeleteEmbed],
      })
      return;
    } catch (e) {
      console.log(`Error in ${__filename} \n ${e}`);
      return;
    }
  }
}