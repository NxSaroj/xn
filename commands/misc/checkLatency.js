const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot current latency")
    .setDMPermission(false),
  run: async ({ interaction, client }) => {
    try {
      const wsPing = client.ws.ping;
      await interaction.reply(`> 👋 Pong ${wsPing}ms`)
    } catch (err) {
      console.error(err)
      return;
    }

  },


};
