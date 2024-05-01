const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const autoroleConfig = require("../../../models/misc/autoroleConfig");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-autorole")
    .setDescription("add a auto-role for guild")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("the target role for autorole")
        .setRequired(true)
    )
    .setDMPermission(false),
  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const role = interaction.options.getRole("role");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
            content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
            ephemeral: true
        })
    }

    const botRolePosition = interaction.guild.members.me.roles.highest.position;
    const targetRolePosition = role.position

    if (targetRolePosition >= botRolePosition) {
        return await interaction.editReply({
            content: "I can't moderate that role",
            ephemeral: true
        })
    }

   
    const isAutoRoleConfigured = await autoroleConfig.findOne({
      guildId: interaction.guild.id,
    });
    try {
        if (isAutoRoleConfigured) {
            return await interaction.editReply({
                content: 'Auto-role for this server has already been configured run `/remove-autorole` to remove the autorole',
                ephemeral: true
            }) 
        } else {
           await autoroleConfig.create({
                roleId: role.id,
                guildId: interaction.guild.id,
            }).then(async()=>{
                const embed = new EmbedBuilder()
                .setDescription(`> ${role} will be assigned upon joinning`)
                .setColor('White')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 })})
                return await interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            })
        }
    } catch (e) {        
        console.error(`Error in ${__filename} \n ${e}`)
        return await interaction.editReply({
            content: 'Error while setting up autorole, try again later',
            ephemeral: true
        })
    }
  },


};
