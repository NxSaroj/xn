const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const tagConfig = require("../../../models/misc/tags/tagConfig");
module.exports = {
  data: {
    name: "tag-create",
    description: "Try Out Tag Module | Under DEV",
    options: [
      {
        name: "tag-name",
        description: "The name of the tag",
        type: 3,
        required: true,
      },
    ],
    dm_permission: false,
  },
  /**
   *
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction }) => {
    try {
      if (!interaction.memberPermissions.has("ModerateMembers")) {
        return await interaction.reply({
          content:
            "You need `Moderate Members(s)` permissions to execute this command",
          ephemeral: true,
        });
      }
      const tagName = interaction.options.getString("tag-name");
      if (
        tagName.includes(".") ||
        tagName.includes(",") ||
        tagName.includes("!")
      ) {
        return await interaction.reply({
          content: "Tag name cannot includes zalgo characters",
          ephemeral: true,
        });
      }

      const isTagExist = await tagConfig
        .findOne({
          guildId: interaction.guild.id,
          tagName: tagName,
        })
        .catch((err) => {
          console.error(err);
          return interaction.reply({
            content: "DB Error, Try Again Later",
            ephemeral: true,
          });
        });

      if (isTagExist) {
        const modal = new ModalBuilder()
          .setCustomId("tag-modal")
          .setTitle("Add Tag");

        const nameInput = new TextInputBuilder()
          .setCustomId("tag-name")
          .setLabel("Tag Name")
          .setValue(isTagExist.tagName)
          .setStyle(TextInputStyle.Short);

        const contentInput = new TextInputBuilder()
          .setCustomId("tag-content")
          .setLabel("Tag Content")
          .setValue(isTagExist.tagContent)
          .setPlaceholder("You can use TagScript Here")
          .setStyle(TextInputStyle.Paragraph);

        const row1 = new ActionRowBuilder().addComponents(nameInput);
        const row2 = new ActionRowBuilder().addComponents(contentInput);

        modal.addComponents(row1, row2);
        await interaction.showModal(modal);
      } else {
        const modal = new ModalBuilder()
          .setCustomId("tag-modal")
          .setTitle("Add Tag");

        const nameInput = new TextInputBuilder()
          .setCustomId("tag-name")
          .setLabel("Tag Name")
          .setStyle(TextInputStyle.Short);

        const contentInput = new TextInputBuilder()
          .setCustomId("tag-content")
          .setLabel("Tag Content")
          .setPlaceholder("You can use TagScript Here")
          .setStyle(TextInputStyle.Paragraph);

        const row1 = new ActionRowBuilder().addComponents(nameInput);
        const row2 = new ActionRowBuilder().addComponents(contentInput);

        modal.addComponents(row1, row2);
        await interaction.showModal(modal);
      }
    } catch (error) {
      return console.error(`Error in ${__dirname} \n Error: ${error}`);
    }
  },
  options: {
    devOnly: true
  }
};
