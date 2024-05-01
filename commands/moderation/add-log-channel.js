const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const logsConfig = require("../../models/moderation/logs/logsConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-log-channel")
    .setDescription("Add a channel for logging")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel for logging")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .setDMPermission(false),
  run: async ({ interaction }) => {
    const channel = interaction.options.getChannel("channel");
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content:
          "**Required permissions** <:xn_arrow:1206238725130952755> `Administrator`",
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const guildConfigration = await logsConfig.findOne({
      guildId: interaction.guild.id,
    });
    const isChannelConfigured = await logsConfig.findOne({
      channelId: channel.id,
    });

    try {
      if (guildConfigration) {
        return await interaction.editReply({
          content:
            "Logs configration has already been setup in the guild, \n Run `/remove-log-channel` to disable log channel",
          ephemeral: true,
        });
      } else if (isChannelConfigured) {
        return await interaction.editReply({
          content: `${channel} Is already been setup-as logs channel`,
          ephemeral: true,
        });
      } else {
        try {
          await logsConfig
            .create({
              channelId: channel.id,
              guildId: interaction.guild.id,
            })
            .then(async () => {
              const embed = new EmbedBuilder()
                .setDescription(
                  `> **Logs Channel Added** <:xn_arrow:1206238725130952755> ${channel}`
                )
                .setColor("White");
              await interaction.editReply({
                embeds: [embed],
              });
              return;
            });
        } catch (err) {
          console.error(__filename, err);
        }
      }
    } catch (err) {
      console.error(__filename, err);
    }
  },


};
