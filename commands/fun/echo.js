const { ApplicationCommandOptionType, Interaction } = require("discord.js");
module.exports = {
  data: {
    name: "echo",
    description: "Ben 10 Echo",
    options: [
      {
        name: "message",
        description: "Message to echo",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "channel",
        description: "Channel to echo",
        type: ApplicationCommandOptionType.Channel,
      },
    ],
    dm_permission: false,
  },
  /**
   *
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction }) => {
    if (!interaction.memberPermissions.has("ManageMessages")) {
      return await interaction.reply({
        content:
          "You need `Manage Message(s)` permissions to execute this command",
        ephemeral: true,
      });
    }
    const channel = interaction.options.getChannel("channel");
    const targetChannel = channel || interaction.channel;
    if (!targetChannel) {
      return await interaction.reply({
        content: "Please provide a valid channel",
        ephemeral: true,
      });
    }

    try {
      const message = interaction.options.getString("message");
      await channel
        .send({
          content: message,
        })
        .then(async () => {
          await interaction.reply({
            content: "Message Has Been Sent",
          });
        })
        .catch(async (err) => {
          await interaction.reply({
            content: "I Don't have permissions to send message there",
            ephemeral: true,
          });
          return;
        });
    } catch (err) {
      console.error(`Error in ${__filename} \n ${err}`);
      return;
    }
  },
};
