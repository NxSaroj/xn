const { Events, EmbedBuilder, PermissionsBitField, Interaction } = require("discord.js");
const suggestionConfig = require("../../models/misc/suggestionConfig");

module.exports = {
  name: Events.InteractionCreate,
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   * @returns 
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    try {
      const [type, suggestionId, action] = interaction.customId.split(".");
      if (!type || !suggestionId || !action) return;
      if (type !== "suggestion") return;
      await interaction.deferReply({ ephemeral: true });

      const targetSuggestion = await suggestionConfig.findOne({
        suggestionId,
      });
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
          return await interaction.editReply({
            content:
              "You need `Manage Guild(s)` permissions to execute this command",
            ephemeral: true,
          });
        }

        targetSuggestion.status = "Approve";
        targetMessageEmbed.fields[1].value = "Approved";
        targetMessageEmbed.data.color = 0x00FF42

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
            ephemeral: true,
          });
        }
      
        targetSuggestion.status = "Rejected";
        targetMessageEmbed.fields[1].value = "Rejected";
        targetMessageEmbed.data.color = 0xff0000

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
        ephemeral: true,
      });
      return;
    }
  },
};
