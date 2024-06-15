import type { CommandData } from 'commandkit';
import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import tagConfig from '../../../models/misc/tags/tagConfig'

export const data:CommandData = {
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
}

export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
  if (!interaction.inCachedGuild()) return
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
      tagName?.includes(".") ||
      tagName?.includes(",") ||
      tagName?.includes("!")
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

      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);

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

      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);

      modal.addComponents(row1, row2);
      await interaction.showModal(modal);
    }
  } catch (error) {
    return console.error(`Error in ${__dirname} \n Error: ${error}`);
  }
}