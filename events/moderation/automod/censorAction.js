const { Events, Message } = require("discord.js");
const censorConfig = require("../../../models/moderation/automod/censorConfig");

module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message) {
    const isCensorConfigured = await censorConfig.findOne({
      guildId: message.guild.id,
    });
    if (!isCensorConfigured) return;
    const censorWords = isCensorConfigured.censorWords;
    const censorPunishment = isCensorConfigured.censorPunishment;
    let censorLimit = 0;
    try {
      if (censorWords.includes(message.content)) {
        if (
          message.member.permissions.has("Administrator") ||
          message.member.permissions.has("ModerateMembers") ||
          message.member.permissions.has("KickMembers")
        )
          return;
        censorLimit += 1;
        const isUserMonitored = await censorConfig.findOne({
          userId: message.author.id,
          guildId: message.guildId,
        });
        if (!isUserMonitored)
          await censorConfig.create({
            userId: message.author.id,
            censorLimit: censorLimit,
            guildId: message.guild.id,
          });
        if (isUserMonitored.censorLimit >= isUserMonitored.censorThreshold) {
          switch (censorPunishment) {
            case "Timeout":
              await message.member.timeout(120_000).catch((err) => {
                return;
              });
              await censorConfig.deleteMany({
                guildId: message.guildId,
                userId: message.author.id,
              });
              break;
            case "Ban":
              await message.member
                .ban({ reason: "Link threshold reached" })
                .catch((err) => {
                  return;
                });
              await censorConfig.deleteMany({
                guildId: message.guildId,
                userId: message.author.id,
              });

              break;
            case "Kick":
              await message.member
                .kick({ reason: "Link threshold reached" })
                .catch((err) => {
                  return;
                });
              await censorConfig.deleteMany({
                guildId: message.guildId,
                userId: message.author.id,
              });
              break;
          }
        } else {
          isUserMonitored.censorLimit += 1;
          await isUserMonitored.save();
        }
        await message
          .delete()
          .then(async () => {
            const response = await message.channel.send(
              `That word isn't allowed here`
            );
            setTimeout(async () => {
              await response.delete();
            }, 2_000);
          })
          .catch((err) => {
            return;
          });
      }
    } catch (err) {
      console.error(`Error in ${__filename} \n ${err}`);
      return;
    }
  },
};
