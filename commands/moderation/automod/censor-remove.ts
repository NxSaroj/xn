import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
  Interaction
} from "discord.js";
import censorConfig from "../../../models/moderation/automod/censorConfig";
import { CommandData, SlashCommandProps, CommandOptions } from "commandkit";

export const data: CommandData = {
  name: "censor-remove",
  description: "remove a censor word from automod",
  options: [
    {
      name: "word",
      description: "The censored word to remove",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  dm_permission: false,
};

export async function run({ interaction }: import('commandkit').SlashCommandProps) {
if (!interaction.guild) return
if (!interaction.member) return

  if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers))
   {
    await interaction.reply({
      content:
        "You need to have `Moderate Member(s)` permissions to execute this command",
      ephemeral: true,
    });
    return;
  }

  const isCensorEnabled = await censorConfig.findOne({
    guildId: interaction.guild.id,
  });

  const word = interaction.options.getString("word") || ""

  if (!isCensorEnabled) {
    await interaction.reply({
      content: "Censor system has not been configured for the server",
      ephemeral: true,
    });
    return;
  }

  const censorWords = isCensorEnabled.censorWords
  if (!censorWords.includes(word)) {
    await interaction.reply({
        content: "That word is not in censorList",
        ephemeral: true
    })
    return
  }
  censorConfig
    .findOneAndDelete({
      censorWords: word,
    })
    .then(() => {
      interaction.reply({
        content: "Deleted that word from censor list",
        ephemeral: true,
      });
      return;
    })
    .catch((e) => {
      console.error(`Error: ${e}`);
      interaction.reply({
        content: "DB Error, try again later",
        ephemeral: true,
      });
      return;
    });
}
