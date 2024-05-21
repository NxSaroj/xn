import {
  EmbedBuilder,
  ApplicationCommandOptionType,
} from "discord.js";
import type { SlashCommandProps, CommandData } from "commandkit";

export const data: CommandData = {
  name: "8ball",
  description: "Xantrack will answer your questions",
  options: [
    {
      name: "question",
      description: "Question you want to ask",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
  const question = interaction.options.getString("question");
  const response = [
    "Yes",
    "Never",
    "You Really Think? Lmao",
    "For Sure",
    "In Your Dreams",
    "Better",
    "Dumb Question",
    "Ask Again Later",
    "100%",
    "-99",
    "Less then your iq",
    "No",
    "Amazing",
    "Awesome",
    "Here we go again",
    "LOL",
    "Dumb",
    "Rat",
  ];

  const randomResponse = response[Math.floor(Math.random() * response.length)];
  const responseEmbed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL({ size: 256 }),
    })
    .setDescription(
      `**Question** <:xn_arrow:1207610123778920448> ${question} \n\n **Answer** \<:xn_arrow:1207610123778920448> ${randomResponse}`
    )
    .setColor("White");

  try {
    await interaction.reply({
      embeds: [responseEmbed],
    });
    return;
  } catch (err) {
    console.error(`Error in ${__filename} \n ${err}`);
    return;
  }
}
