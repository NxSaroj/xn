import { Events } from 'discord.js'
import antiLinkConfig from '../../../models/moderation/automod/antiLinkConfig'


export default {
  name: Events.MessageCreate,
  run: async (message: import('discord.js').Message) => {
    if (
      message.content.startsWith("https://") ||
      message.content.startsWith("discord.gg/") ||
      message.content.startsWith("www.") ||
      message.content.startsWith("http://")
    ) {
      if (!message.guild) return;
      if (!message.member) return;
      const isLinkFilterEnabled = await antiLinkConfig.findOne({
        guildId: message?.guild?.id,
      });
  
      if (!isLinkFilterEnabled) return;
      const whiteListLinks = isLinkFilterEnabled.whiteListLink;
      const linkThreshold = isLinkFilterEnabled.linkThreshold;
      const linkPunishment = isLinkFilterEnabled.punishMent;
      const dmMessage = isLinkFilterEnabled.dmMessage
        .replace("{target(user.username)}", `${message.author.username}`)
        .replace("{target(user.mention)}", `<@${message.author.id}>`)
        .replace("{guild.name}", `${message.guild.name}`)
        .replace("{guild(name)}", `${message.guild.name}`);
  
      const ignoreRole = isLinkFilterEnabled?.ignoreRoleId;
  
      const replyMessage = isLinkFilterEnabled.replyMessage
        .replace("{target(user.username)}", `${message.author.username}`)
        .replace("{target(user.mention)}", `<@${message.author.id}>`)
        .replace("{guild.name}", `${message.guild.name}`)
        .replace("{guild(name)}", `${message.guild.name}`);
  
      if (whiteListLinks.includes(message.content)) return;
      if (
        message.member.permissions.has("Administrator") ||
        message.member.permissions.has("ModerateMembers") ||
        message.member.permissions.has("KickMembers") ||
        message.member.roles.cache.find((role) => role.id == ignoreRole)
      )
        return;
      let linkSent = 0;
      linkSent++;
      let isUserMonitored = await antiLinkConfig.findOne({
        userId: message.author.id,
        guildId: message.guildId,
        dmMessage: "",
        replyMessage: "",
        linkThreshold: "",
        punishMent: "",
        timeStamps: "",
        whiteListLink: "",
      });
      if (!isUserMonitored) {
        isUserMonitored = await antiLinkConfig.create({
          userId: message.author.id,
          linkCount: linkSent,
          guildId: message.guildId,
          dmMessage: "",
          replyMessage: "",
          linkThreshold: "",
          punishMent: "",
          timeStamps: "",
          whiteListLink: "",
        });
      }
  
      if (isUserMonitored.linkCount >= linkThreshold) {
        switch (linkPunishment) {
          case "Timeout":
            await message.member.timeout(120_000).catch(() => {
              return;
            });
            await antiLinkConfig.deleteMany(
              { userId: message.author.id },
              { guildId: message.author.id }
            ).catch(() => {})
  
            break;
          case "Ban":
            await message.member
              .ban({ reason: "Link threshold reached" })
              .catch(() => {
                return;
              });
            await antiLinkConfig.deleteMany(
              { userId: message.author.id },
              { guildId: message.author.id }
            ).catch(() => {})
  
            break;
          case "Kick":
            await message.member
              .kick(`Link Threshold Reached`)
              .catch(() => {
                return;
              });
            await antiLinkConfig.deleteMany(
              { userId: message.author.id },
              { guildId: message.author.id }
            ).catch(() => {})
  
            break;
        }
      } else {
        isUserMonitored.linkCount += 1;
        await isUserMonitored.save().catch(() => {})
      }
  
      await message.delete().catch(() => {})
      const response = await message.channel.send(replyMessage);
      await message.author.send(dmMessage);
      setTimeout(() => {
        response.delete();
      }, 1000);
  }
}
}