const { Events, EmbedBuilder } = require("discord.js");
const welcomeConfig = require("../../models/welcome/welcomeConfig");
/**
 * @param {import('discord.js').GuildMember} guildMember
 */
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(guildMember) {
    const guildId = guildMember.guild.id;
    const existingSetup = await welcomeConfig.findOne({ guildId: guildId });
    const welcomeConfigs = await welcomeConfig.find({
      guildId: guildMember.guild.id,
    });
    if (!existingSetup) {
      return;
    }
    const targetChannel = guildMember.guild.channels.cache.get(
      existingSetup.channelId
    );

    for (const welcomeConfig of welcomeConfigs) {
      const customMessage = welcomeConfig.customMessage;
      const messageContent = welcomeConfig.messageContent
      .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
      .replace(`{target(user.username)}`, `${guildMember.user.username}`)
      .replace(`{guild.name}`, `${guildMember.guild.name}`);
      try {
        const title = customMessage[0].data.title
          .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
          .replace(`{target(user.username)}`, `${guildMember.user.username}`)
          .replace(`{guild.name}`, `${guildMember.guild.name}`)
          .replace(`{guild(memberCount)}`, `${guildMember.guild.memberCount}`)


        const description = customMessage[0].data.description
          .replace(`{target(user.mention)}`, `<@${guildMember.id}>`)
          .replace(`{target(user.username)}`, `${guildMember.user.username}`)
          .replace(`{guild.name}`, `${guildMember.guild.name}`)
          .replace(`{guild(memberCount)}`, `${guildMember.guild.memberCount}`);


             let thumbnail = customMessage[0].data.thumbnail
        
    	if (thumbnail == `{target(avatar)}`) {
        thumbnail = guildMember.displayAvatarURL();
}
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setImage(customMessage[0].data.image || null)
          .setThumbnail(thumbnail)
          .setColor(customMessage[0].data.color);

         targetChannel.send({ content: messageContent, embeds: [embed] })
      } catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
      }
    }

    if (!targetChannel) {
      console.error("error");
      return;
    }
  },
};
