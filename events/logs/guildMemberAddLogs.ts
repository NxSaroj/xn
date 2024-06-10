import { Events, EmbedBuilder, type GuildMember } from 'discord.js'
import logsConfig from '../../models/moderation/logs/logsConfig'


export default {
  name: Events.GuildMemberAdd,
  run: async (guildMember: GuildMember) => {
    const guildConfig = await logsConfig.findOne({ guildId: guildMember.guild.id });
    if (!guildConfig) return;
    if (!guildConfig.welcomeLog) return
    const channel = guildMember.guild.channels.cache.get(guildConfig.channelId);
      
    if (!channel) return;

    const guildMemberAdd = new EmbedBuilder()
      .setAuthor({
        name: guildMember.user.username,
        iconURL: guildMember.displayAvatarURL({ size: 256 }),
      })
      .setDescription(
        `**Member joined** \n\n > **Member** <:xn_arrow:1206238725130952755> ${guildMember.user.username} \n > **Member Count** <:xn_arrow:1206238725130952755> ${guildMember.guild.memberCount} \n\n`
      )
      .setColor("White")

      try {
        if (!channel.isTextBased()) return;
        await channel.send({
            embeds: [guildMemberAdd]
        })
        return;
      } catch (err) {
        console.error(__filename, err)
      }
  }
}