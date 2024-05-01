const { SlashCommandBuilder, ComponentType, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('vkick')
    .setDescription('Kick a user on vote count')
    .addUserOption((option)=>option.setName('user').setDescription('The user for vote kicking').setRequired(true))
    .addIntegerOption((option)=>option.setName('count').setDescription('Count on which user will be kicked').setMinValue(1).setMaxValue(100).setRequired(true))
    .setDMPermission(false),
    run: async ({ interaction }) => {
        const user = interaction.options.getMember('user')
        const kickCount = interaction.options.getInteger('count')
        let variableCount = 0;
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({
                content: 'You need `Kick Member(s)` permission to execute this command',
                ephemeral: true,
            })
        }


        if (user.id == interaction.user.id) {
            return await interaction.reply({
                content: 'You cant vkick on yourself',
                ephemeral: true,
            })
        }

        if (!user) {
            return await interaction.reply({
                content: 'The user is not present in the guild',
                ephemeral: true,
            })
        }


    const targetUserRolePosition = user.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot


    if (targetUserRolePosition >= requestUserRolePosition) {
        return await interaction.reply({
            content: 'You cant apply vkick on that user',
            ephemeral: true
        })
    } else if (targetUserRolePosition >= botRolePosition) {
        return await interaction.reply({
            content: 'I cant vote-kick that user',
            ephemeral: true
        })
    }

        const voteButton = new ButtonBuilder()
        .setLabel('Vote')
        .setCustomId('vote')
        .setStyle(ButtonStyle.Danger)

        const row1 = new ActionRowBuilder().addComponents(voteButton)

      const vKickEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${user.user.username}`,
        iconURL: user.displayAvatarURL({
            size: 256
        })
      })
      .setDescription(`**Vote Count Started** \n\n **Willing to kick ${user.user.username}** \n \n ${user.user.username} Will be kicked on casting **${kickCount}** votes `)
      .setColor('White')

     const response = await interaction.reply({
        embeds: [vKickEmbed],
        components: [row1]
      })

      const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });

      collector.on('collect', async (i) => {
        if (i.customId == 'vote') {
            variableCount+=1
            await i.reply({
                content: 'Vote submitted',
                ephemeral: true,
            })

            if (variableCount >= kickCount) {
                try {
                    await user.kick().then(async()=>{
                        vKickEmbed.setDescription(` > **${user}** Has Been Kicked From The Server`)
                        await response.edit({
                           embeds: [vKickEmbed],
                           components: []
                        })
                   })
                } catch (e) {
                    console.error(`Error in ${__filename} \n ${e}`)
                }
            }
        }
      })

      



    },


}