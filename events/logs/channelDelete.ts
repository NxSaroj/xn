import { EmbedBuilder, Events } from 'discord.js'
import logsConfig from '../../models/moderation/logs/logsConfig'

export default {
  name: Events.ChannelDelete, 
  run: async (channels:any) => {
    const guildConfig = await logsConfig.findOne({ guildId: channels.guild.id });
    if (!guildConfig) return;
    if (!guildConfig.channelLog) return;
  const channel = channels.guild.channels.cache.get(guildConfig?.channelId);
  
  if (!channel) return;
  
  const channelDeletion = new EmbedBuilder()
  .setAuthor({
    name: channels.guild.name,
    iconURL: channels.guild.iconURL()
  })
  .setDescription(
    `**Channel Deleted** \n\n > **Channel** <:xn_arrow:1206238725130952755> ${channels.name} `
  )
  .setColor("White")
  
  try {
    await channel.send({
        embeds: [channelDeletion]
    })
    return;
  } catch (err) {
    console.error(__filename, err)
  }
  }
}