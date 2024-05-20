const { Events, EmbedBuilder } = require('discord.js')
const logsConfig = require('../../models/moderation/logs/logsConfig')

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(guildMember) {
        const guildConfig = await logsConfig.findOne({ guildId: guildMember.guild.id });
    if (!guildConfig) return;
    if (!guildConfig.welcomeLog) return
    const channel = guildMember.guild.channels.cache.get(guildConfig.channelId);

    if (!channel) return;

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
        await channel.send({
            embeds: [guildMemberLeave]
        })
        return;
      } catch (err) {
        console.error(__filename, err)
      }
    }
}