const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
module.exports = {
  data: {
    name: "server-stats",
    description: "Get information about a server",
    options: [
      {
        name: "server-id",
        description: "Enter the id of the server",
        type: ApplicationCommandOptionType.String,
        required: true
      },
    ],
    default_member_permissions: 0,
    dm_permission: false,
  },
  run: async ({ interaction, client }) => {
    const management = ["1129393606432661575", "750339984598368287"];

    if (!management.includes(interaction.user.id)) {
      return await interaction.editReply({
        content: "This command is owner only",
        ephemeral: true,
      });
    }
    let response;
    try {
      const guildId = interaction.options.getString("server-id");
      const guildName =
        client.guilds.cache.get(guildId) 
      if (!guildName) {
        return await interaction.reply({
          content:
            "Not able to found the guild \n Make sure the bot is in the server",
          ephemeral: true,
        });
      }

      response = await interaction.reply(
        `Fetching the information about guild`
      );

  

      const embed = new EmbedBuilder()
        .setAuthor({
          name: guildName.name,
          iconURL: guildName.iconURL(),
        })
        .addFields(
          {
            name: "Owner",
            value: (await guildName.fetchOwner()).user.username,
            inline: false,
          },
          { name: "Name", value: guildName.name, inline: false },
          { name: "Id", value: guildName.id, inline: false },
        )
        .setColor("White")
        .setThumbnail(guildName.iconURL());

      await response
        .edit({
          content: "",
          embeds: [embed],
        })
        .catch((err) => {
          return console.error(err);
        });
    } catch (err) {
      console.error(`Error in ${__filename} \n ${err}`);
      await response.edit({
        content: "Error occured, Try again later",
      });
      return;
    }
  },
  options: {
    devOnly: true,
  },
};
