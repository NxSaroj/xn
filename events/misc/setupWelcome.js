const { Events, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.content.startsWith("x!welcome")) {
      if (
        !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
      ) {
        const noPermissions = new EmbedBuilder()
          .setColor("White")
          .setDescription(
            "> **Required Permissions**<:xn_arrow:1206238725130952755>`Administrator`"
          );
        return await message.channel.send({ embeds: [noPermissions] });
      } else {
        const commandAvailability = new EmbedBuilder()
          .setDescription(
            "> **Command Availability** <:xn_arrow:1206238725130952755> `Slash Commands Only [/welcome]`"
          )
          .setColor("White");
        return await message.channel.send({ embeds: [commandAvailability] });
      }
    }
  },
};
