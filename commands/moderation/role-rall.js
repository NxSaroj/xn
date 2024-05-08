const {
    ApplicationCommandOptionType,
    PermissionsBitField,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: {
      name: "role-rall",
      description: "Remove a role to all members",
      options: [
        {
          name: "role",
          description: "The role to remove",
          type: ApplicationCommandOptionType.Role,
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
      if (!interaction.guild.members.me.permissions.has('ManageRoles')) {
        return await interaction.reply({
            content: `> I need manage roles permissions to execute this command`
        })
    }
    
      if (
        !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
      ) {
        return await interaction.editReply({
          content:
            "> **Required Permissions** <:xn_arrow:1206238725130952755> `Manage Role(s)`",
          ephemeral: true,
        });
      }
      if (!interaction.guild.members.me.permissions.has('ManageRoles')) {
        return await interaction.reply({
          content: "I don't have permissions to execute this command", 
          ephemeral: true
        })
      }
      const role = interaction.options.getRole("role");
      if (
        role.position >= interaction.member.roles.highest.position ||
        role.position >= interaction.guild.members.me.roles.highest.position
      ) {
        return await interaction.reply({
          content: "I can't moderate that role",
          ephemeral: true,
        });
      }
      
      const embed = new EmbedBuilder()
        .setDescription(
          `<:xn_tick:1209742516832706642> **Stated Removing ${role} to ${interaction.guild.memberCount} members** `
        )
        .setColor("White");
      const reply = await interaction.reply({ embeds: [embed] });
      try {
        interaction.guild.members.cache.forEach(async (member) => {
          await member.roles.remove(role).catch(() => {
            embed.setDescription(
              `**Error While Updating Roles, Make sure i have enough hirachy & permissions**`
            );
            reply.edit({ embeds: [embed] });
            return;
          });
          await embed.setDescription(`**Removed ${role} to ${interaction.guild.memberCount} members**`)
          reply.edit({
              embed: [embed]
          })
        });
      } catch (err) {
        embed.setDescription(
          `**Error While Updating Roles, Make sure i have enough hirachy & permissions**`
        );
        reply.edit({ embeds: [embed] });
        return;
      }
    },
  };
  