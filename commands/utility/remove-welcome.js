const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const welcomeConfig = require("../../models/welcome/welcomeConfig");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-welcome-channel")
    .setDescription("remove a welcome channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to remove")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    )
    .setDMPermission(false),
  run: async ({ interaction }) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "You need `Administrator` permissions to execute this command",
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel("channel");
    const isChannelConfigured = await welcomeConfig.findOne({
      channelId: channel.id,
    });
    const isGuildConfigured = await welcomeConfig.findOne({
      guildId: interaction.guild.id,
    });
    const messageContent = isGuildConfigured.messageContent
    const customMessage = isGuildConfigured.customMessage

    if (!messageContent) return;
    if (!customMessage) return
    if (!isGuildConfigured) {
      return await interaction.reply({
        content: `Welcome channel has not been configured in this channel`,
        ephemeral: true,
      });
    }
    if (!isChannelConfigured) {
      return await interaction.reply({
        content: `${channel} is not configured for welcome messages`,
        ephemeral: true,
      });
    } else {
      await welcomeConfig
        .findOneAndDelete({
          channelId: channel.id,
          guildId: interaction.guild.id,
          messageContent: messageContent,
          customMessage: customMessage
        })
        .then(async () => {
          return await interaction.reply({
            content: `${channel} Has been removed for welcome message`,
            ephemeral: true,
          });
        });
    }
  },


};
