import logsConfig from '../../models/moderation/logs/logsConfig'
import {
    type GuildMember,
    EmbedBuilder,
    Events
} from 'discord.js'
export default {
  name: Events.GuildMemberRemove,
  run: async (guildMember: GuildMember) => {
    const guildConfig = await logsConfig.findOne({ guildId: guildMember.guild.id });
    if (!guildConfig) return;
    if (guildConfig.welcomeLog == false) return
    const channel = guildMember.guild.channels.cache.get(guildConfig.channelId);

    if (!channel) return await logsConfig.deleteMany(
        { guildId: guildMember.guild.id }
    )

    const guildMemberLeave = new EmbedBuilder()
      .setAuthor({
        name: guildMember.user.username,
        iconURL: guildMember.displayAvatarURL({ size: 256 }),
      })
      .setDescription(
        `**Member leaved** \n\n > **Member** <:xn_arrow:1206238725130952755> ${guildMember.user.username} \n > **Member Count** <:xn_arrow:1206238725130952755> ${guildMember.guild.memberCount} \n\n`
      )
      .setColor("White")

      try {
        if (!channel.isTextBased()) return
        await channel.send({
            embeds: [guildMemberLeave]
        })
        return;
      } catch (err) {
        console.error(__filename, err)
      }
  }
}