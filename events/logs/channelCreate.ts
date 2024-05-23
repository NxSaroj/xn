import { Events, EmbedBuilder } from 'discord.js'
import logsConfig  from '../../models/moderation/logs/logsConfig'


export default{
    name: Events.ChannelCreate,
    async execute(channels: import('discord.js').GuildChannel) {
        const guildConfig = await logsConfig.findOne({ guildId: channels.guild.id });
    if (!guildConfig) return;
    if (!guildConfig.channelLog) return;
    const channel = channels.guild.channels.cache.get(guildConfig.channelId) || (
      await channels.guild.channels.fetch(guildConfig.channelId)
    )

    if (!channel) return;

    const channelCreation = new EmbedBuilder()
      .setAuthor({
        name: channels.guild.name,
        iconURL: channels.guild.iconURL()
      })
      .setDescription(
        `**Channel Created** \n\n > **Channel** <:xn_arrow:1206238725130952755> <#${channels.id}> `
      )
      .setColor("White")

      try {
        await channel.send({
            embeds: [channelCreation]
        })
        return;
      } catch (err) {
        console.error(__filename, err)
      }
    }
}