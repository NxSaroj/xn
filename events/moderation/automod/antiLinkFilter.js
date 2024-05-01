const { Events, Message } = require("discord.js");
const antiLinkConfig = require("../../../models/moderation/automod/antiLinkConfig");
module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message) {
    if (
      message.content.startsWith("https://") ||
      message.content.startsWith("discord.gg/") ||
      message.content.startsWith("www.") ||
      message.content.startsWith("http://")
    ) {
      const isLinkFilterEnabled = await antiLinkConfig.findOne({
        guildId: message.guild.id,
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

      const ignoreRole = isLinkFilterEnabled?.ignoreRoleId 
      

      const replyMessage = isLinkFilterEnabled.replyMessage
        .replace("{target(user.username)}", `${message.author.username}`)
        .replace("{target(user.mention)}", `<@${message.author.id}>`)
        .replace("{guild.name}", `${message.guild.name}`)
        .replace("{guild(name)}", `${message.guild.name}`);

      if (ignoreRole) {
        if (whiteListLinks.includes(message.content)) return;
      if (
        message.member.permissions.has("Administrator") ||
        message.member.permissions.has("ModerateMembers") ||
        message.member.permissions.has("KickMembers") ||
        message.member.roles.cache.find(role => role.id == ignoreRole)
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
            await message.member
              .timeout(120_000)
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            await message.member.send();
            break;
          case "Ban":
            await message.member
              .ban({ reason: "Link threshold reached" })
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            break;
          case "Kick":
            await message.member
              .kick({ reason: "Link threshold reached" })
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            break;
        }
      } else {
        isUserMonitored.linkCount += 1;
        await isUserMonitored.save();
      }
      await message
        .delete()
        .then(async () => {
          const response = await message.channel.send(`${replyMessage}`);
          await message.member.send(dmMessage);
          setTimeout(async () => {
            await response.delete();
          }, 2_000);
        })
        .catch((err) => {
          return;
        });
      } else {
        if (whiteListLinks.includes(message.content)) return;
      if (
        message.member.permissions.has("Administrator") ||
        message.member.permissions.has("ModerateMembers") ||
        message.member.permissions.has("KickMembers") 
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
            await message.member
              .timeout(120_000)
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            await message.member.send();
            break;
          case "Ban":
            await message.member
              .ban({ reason: "Link threshold reached" })
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            break;
          case "Kick":
            await message.member
              .kick({ reason: "Link threshold reached" })
              .then(() => {
                antiLinkConfig.deleteMany({
                  guildId: message.guild.id,
                  userId: message.author.id,
                });
              })
              .catch((err) => {
                return;
              });
            break;
        }
      } else {
        isUserMonitored.linkCount += 1;
        await isUserMonitored.save();
      }
      await message
        .delete()
        .then(async () => {
          const response = await message.channel.send(`${replyMessage}`);
          await message.member.send(dmMessage);
          setTimeout(async () => {
            await response.delete();
          }, 2_000);
        })
        .catch((err) => {
          return;
        });
      }
    }
  },
};
