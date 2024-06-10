import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  ActionRowBuilder,
  type ModalSubmitInteraction
} from 'discord.js'
import guildConfig from "../../../models/misc/guildConfig"
import suggestionConfig from '../../../models/misc/suggestionConfig'

export default {
  name: Events.InteractionCreate,
  run: async (interaction: ModalSubmitInteraction) => {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId == "suggestion-modal") {
      const isSuggestionConfigured = await guildConfig.findOne({
        guildId: interaction.guild.id,
      });

      const suggestion =
        interaction.fields.getTextInputValue("suggestion-content");
      try {
        const targetChannel = interaction.guild.channels.cache.get(
          isSuggestionConfigured?.channelId
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

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          approveButton,
          rejectButton
        );

        try {
          await interaction.reply({
            content: "Thanks, Your suggestion has been created for the guild",
          });
          if (!targetChannel?.isTextBased()) return;
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
    }
  },
};
