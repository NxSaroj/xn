import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} from "discord.js";
import type { CommandData, SlashCommandProps } from "commandkit";

export const data: CommandData = {
  name: "role-add",
  description: "Add a role to the user",
  options: [
    {
      name: "role",
      description: "The role to assign",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "user",
      description: "The user to assing the role",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
    if (!interaction.inCachedGuild()) return
  if (!interaction.guild.members?.me?.permissions.has("ManageRoles")) {
    return await interaction.reply({
      content: `> I need manage roles permissions to execute this command`,
    });
  }

  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
  ) {
    return await interaction.editReply({
      content:
        "> **Required Permissions** <:xn_arrow:1206238725130952755> `Manage Role(s)`",
    });
  }

  const targetRole = interaction.options.getRole("role");
  const user = interaction.options.getMember("user");

  if (!user) {
    return await interaction.reply({
      content: `That user has leaved from the guild`,
      ephemeral: true,
    });
  }

  const requestUserRolePosition = interaction.member.roles.highest.position;
  const botRolePosition = interaction.guild.members.me.roles.highest.position;
  const rolePosition = targetRole.position;

  if (rolePosition >= botRolePosition) {
    return await interaction.reply({
      content: "I cant assing that role",
      ephemeral: true,
    });
  } else if (rolePosition >= requestUserRolePosition) {
    return await interaction.reply({
      content: "You cant assing that role",
      ephemeral: true,
    });
  } else {
    try {
      if (user.roles.cache.some((role) => role.id === targetRole?.id)) {
        return await interaction.reply({
          content: "The user alredy have that role",
          ephemeral: true,
        });
      }
      user.roles.add(targetRole).then(async () => {
        const embed = new EmbedBuilder()
          .setDescription(
            `> **Role Added** <:xn_arrow:1206238725130952755> ${targetRole}`
          )
          .setColor("White")
          .setTimestamp();
        await interaction.reply({
          embeds: [embed],
        });
        return;
      });
    } catch (e) {
      console.log(`Error in ${__filename} \n ${e}`);
      return await interaction.reply({
        content: "Error while adding the role, try again later",
        ephemeral: true,
      });
    }
  }
}
