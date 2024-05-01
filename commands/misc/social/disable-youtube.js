const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const youtubeConfig = require("../../../models/premium/youtubeConfig");
module.exports = {
  data: {
    name: "disable-youtube",
    description: "Disable the notification settings for youtube",
    dm_permission: false,
  },
  run: async ({ interaction }) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.editReply({
        content:
          "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
        ephemeral: true,
      });
    }

    const isYoutubeConfigured = await youtubeConfig
      .exists({
        guildId: interaction.guild.id,
      })
      .catch((err) => {
        return console.error(`Error in ${__filename} \n ${err}`);
      });

    if (!isYoutubeConfigured) {
      return await interaction.reply({
        content: "Nothing Changed, As No Youtube Channel Is Configured",
        ephemeral: true,
      });
    }

    await youtubeConfig
      .deleteMany({
        guildId: interaction.guild.id,
      })
      .then(async () => {
        const embed = new EmbedBuilder()
          .setColor("White")
          .setDescription(
            `<:xn_tick:1209742516832706642> Youtube Notification Configration System Has Been Disabled`
          );
        await interaction.reply({
          embeds: [embed],
        });
      })
      .catch(async (err) => {
        console.error(err);
        await interaction.reply({
          content: "DB Error, Try Again Later",
          ephemeral: true,
        });
        return;
      });
  },
};
