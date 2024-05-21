import { Events, EmbedBuilder, PermissionsBitField, Interaction } from 'discord.js'
import suggestionConfig from '../../models/misc/suggestionConfig'
export default {
  name: Events.InteractionCreate,
  async execute(interaction: import('discord.js').ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (!interaction.inCachedGuild()) return
    if (!interaction.channel) return;
    try { 
      const [type, suggestionId, action] = interaction.customId.split(".");
      if (!type || !suggestionId || !action) return;
      if (type !== "suggestion") return;
      await interaction.deferReply({ ephemeral: true });

      const targetSuggestion = await suggestionConfig.findOne({
        suggestionId,
      });
      if (!targetSuggestion) return await interaction.reply({
        content: "Suggestion Has Been Removed From DB, Try Again Later"
      })
      const targetMessage = await interaction.channel.messages.fetch(
        targetSuggestion.messageId
      );

      const targetMessageEmbed = targetMessage.embeds[0]


      if (action === "approve") {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.ManageGuild
          )
        ) {
           await interaction.editReply({
            content:
              "You need `Manage Guild(s)` permissions to execute this command",
          });
          return;
        }

        targetSuggestion.status = "Approve";
        targetMessageEmbed.fields[1].value = "Approved";
        EmbedBuilder.from(targetMessageEmbed).setColor('Green')

        await targetSuggestion.save();
        await interaction.editReply(
          "That Suggestion Has Been Approved and updated"
        );

        await targetMessage.edit({
          embeds: [targetMessageEmbed],
        });
      }

      if (action === "reject") {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.ManageGuild
          )
        ) {
          return await interaction.editReply({
            content:
              "You need `Manage Guild(s)` permissions to execute this command",
            
          });
        }
      
        targetSuggestion.status = "Rejected";
        targetMessageEmbed.fields[1].value = "Rejected";
        EmbedBuilder.from(targetMessageEmbed).setColor('Red')

        await targetSuggestion.save();
        await interaction.editReply(
          "That Suggestion Has Been Rejected and updated"
        );

        await targetMessage.edit({
          embeds: [targetMessageEmbed],
        });
      }
    } catch (err) {
      console.error(`Error in ${__filename} \n ${err}`);
      await interaction.editReply({
        content: "Error camed, Try again later",
      });
      return;
    }
  },
};
