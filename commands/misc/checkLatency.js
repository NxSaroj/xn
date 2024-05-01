const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot current latency")
    .setDMPermission(false),
  run: async ({ interaction, client }) => {
let message;
    try {
      
      const wsPing = client.ws.ping;
      let roundTrip;
      const embed = new EmbedBuilder()
      .setColor('White')
      .setDescription(`<a:Loading:1215684190968750150> Fetching the latency`)

       message = await interaction.reply({
        embeds: [embed],
        fetchReply: true
      })

      roundTrip = message.createdTimestamp - interaction.createdTimestamp;
      embed.setDescription()
      embed.setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 276 })
      })
      embed.addFields(
        { name: 'Ws Ping', value: `${wsPing}ms` },
        { name: 'Roundtrip Ping', value: `${roundTrip}ms` },
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL({ size: 256 })
      })

      await message.edit({
        embeds: [embed]
      })
    } catch (err) {
      console.error(err)
      await message.edit({
        embeds: [], 
        content: "Error occured, Try again later"
      })
      return;
    }

  },


};
