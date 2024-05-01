const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  MessageCollector,
  ChannelType,
} = require("discord.js");
const welcomeConfig = require("../../models/welcome/welcomeConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome-config")
    .setDescription("Configure your welcome channel settings")
    .setDMPermission(false),
  run: async ({ interaction }) => {
    
    await interaction.deferReply()

    const isConfigured = await welcomeConfig.findOne({
      guildId: interaction.guild.id,
    });

    const noPermissions = new EmbedBuilder()
      .setDescription(
        " > **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`"
      )
      .setColor("White");
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.editReply({
        embeds: [noPermissions],
        ephemeral: true,
      });
    }

    if (!isConfigured) {
      await interaction.editReply({
        content: "Run `/add-welcome-channel` first then execute this comamnd",
        ephemeral: true,
      });
      return;
    }

    let isWelcomeMessage = isConfigured.messageContent;
    let welcomeEmbeds = isConfigured.customMessage
    let welcomeEmbed = "`Present [/add-welcome-channel]`";

    if (!welcomeEmbeds) {
      welcomeEmbed = '`Not Set [/add-welcome-channel]`'
    }

    let welcomeMessage = "`Not set`";
  const channelId = isConfigured.channelId;
    const channel = interaction.guild.channels.cache.get(channelId);

    if (!channel) {
      // Channel doesn't exist, delete data
      await welcomeConfig.findOneAndDelete({
        guildId: interaction.guild.id,
        channelId: channelId,
        customMessage: isConfigured.customMessage,
        messageContent: isConfigured.messageContent,
      });
      return await interaction.editReply({
        content: "Welcome channel deleted. Run `/add-welcome-channel` to set a new one.",
        ephemeral: true,
      });
    }

    if (isWelcomeMessage == null) {
      welcomeMessage = "`Not set`";
    } else if (welcomeMessage) {
      welcomeMessage = "`Present`";
    }


    const placeHoldersButton = new ButtonBuilder()
      .setCustomId("placeholder")
      .setLabel("Placeholders")
      .setStyle(ButtonStyle.Danger);

   

    const row = new ActionRowBuilder().addComponents(
      placeHoldersButton
    );

    const placeHoldersEmbed = new EmbedBuilder()
    .setDescription(`**PlaceHolders** \n\n > **{target(user.mention)}** <:xn_arrow:1206238725130952755> __Mentions the guild member__ \n > **{target(user.username)}** <:xn_arrow:1206238725130952755> __Mentions the guild member username__  \n e__> **{guild.name}** <:xn_arrow:1206238725130952755> __Mentions the guild name \n  > **{guild(memberCount)}** <:xn_arrow:1206238725130952755> __Mentions the guild memberCount__`)
    .setColor('White')

    const { guild } = interaction;
    const welcomeConfigEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ size: 256 }) })
      .setColor("White")
      .setDescription(
        `\n > **Welcome Channel** <:xn_arrow:1206238725130952755> ${channel} \n > **Welcome Embed** <:xn_arrow:1206238725130952755> ${welcomeEmbed} \n > **Welcome Message** <:xn_arrow:1206238725130952755> ${welcomeMessage} \n\n **PLACEHOLDERS** \n\n >  **{target(user.mention)}** <:xn_arrow:1206238725130952755> Mention the target user \n > **{target(user.username)}** <:xn_arrow:1206238725130952755> Mention the target user username \n > **{guild.name}** <:xn_arrow:1206238725130952755> Mention the guild name \n > **{guild(memberCount)}** <:xn_arrow:1206238725130952755> Mention the guild member count`
      )
      .setThumbnail(guild.iconURL());
    try {
      const response = await interaction.editReply({
        embeds: [welcomeConfigEmbed],
        components: [row],
      });
    } catch (err) {
      console.error(err);
      return;
    }
  },

};
