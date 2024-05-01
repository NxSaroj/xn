const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const guildConfig = require("../../models/misc/guildConfig");
const suggestionConfig = require("../../models/misc/suggestionConfig");
const formatResults = require("../../utilities/formatResult");


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId == 'suggestion-modal') return;

    const isSuggestionConfigured = await guildConfig.findOne({
      guildId: interaction.guild.id,
    });

    const suggestion =
      interaction.fields.getTextInputValue("suggestion-content");
    try {
      const targetChannel = interaction.guild.channels.cache.get(
        isSuggestionConfigured.channelId
      );

      const newSuggestion = new suggestionConfig({
        guildId: interaction.guild.id,
        authorId: interaction.user.id,
        messageId: "", // This will be updated later
        content: suggestion,
      });

      await newSuggestion.save();

      const suggestionEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 256 }),
        })
        .addFields(
          { name: "Suggestion", value: suggestion },
          { name: "Status", value: "Pending" },
          { name: "Votes", value: formatResults() }
        )
        .setColor("White");

      const approveButton = new ButtonBuilder()
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`)
        .setEmoji("1209742516832706642")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success);

      const rejectButton = new ButtonBuilder()
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`)
        .setEmoji("1211166597297733713")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(
        approveButton,
        rejectButton
      );

      try {
        await interaction.reply({
          content: "Thanks, Your suggestion has been created for the guild",
        });
        const suggestionMessage = await targetChannel.send({
          content: "",
          embeds: [suggestionEmbed],
          components: [row],
        });
        newSuggestion.messageId = suggestionMessage.id;
        await newSuggestion.save();
      } catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        return;
      }
    } catch (err) {
      console.error(`Error in ${__filename} \n ${err}`);
      return;
    }
   
  },
};