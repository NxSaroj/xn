import { Client, Interaction, ApplicationCommandOptionType, PermissionsBitField, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import ms from 'ms';

export const data =  new SlashCommandBuilder()
.setName('timeout')
.setDescription('Timeout a user')
.addUserOption((option) => option.setName('target-user').setDescription('The user to timeout').setRequired(true))
.addStringOption((option) => option.setName('duration').setDescription('Timeout duration, 30 minutes, 30m').setRequired(true))
.addStringOption((option) => option.setName('reason').setDescription('Reason for timing out the user').setRequired(false))
.setDMPermission(false)

export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
 if (!interaction.inCachedGuild()) return
  if (!interaction.guild?.members?.me?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return await interaction.reply({
        content: `> I need moderate members permission to execute this command`
    })
}
  const mentionable = interaction.options.getMember('target-user');
  const duration = interaction.options.getString('duration'); // 1d, 1 day, 1s 5s, 5m
  const reason = interaction.options.getString('reason') || 'No reason provided';

  await interaction.deferReply()
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return await interaction.editReply({
      content: 'You need `Moderate Member(s)` permissions to execute this command',
    })
  }

  if (mentionable?.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return await interaction.editReply({
      content: 'The user cant be timed out as it have adminstator permissions',
    })
  }

  if (!mentionable) {
    await interaction.editReply("The user is not available in the server");
    return;
  }

  if (mentionable.user.bot) {
    await interaction.editReply("I can't timeout a bot.");
    return;
  }

  const msDuration = ms(duration);
  if (isNaN(msDuration)) {
    await interaction.editReply('Please provide a valid timeout duration.');
    return;
  }

  if (msDuration < 5000 || msDuration > 2419200000) {
    await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.');
    return;
  }

  const targetUserRolePosition = mentionable.roles.highest.position;
  const requestUserRolePosition = interaction.member.roles.highest.position; 
  const botRolePosition = interaction.guild.members.me.roles.highest.position; 

  if (targetUserRolePosition >= requestUserRolePosition) {
    await interaction.editReply("You cant moderate that member");
    return;
  }

  if (targetUserRolePosition >= botRolePosition) {
    await interaction.editReply("I cant moderate that member");
    return;
  }



  try {
    const { default: prettyMilliseconds } = await import("pretty-ms");

    const embed = new EmbedBuilder()
    .setDescription(`> ${mentionable} Has been timeout for ${prettyMilliseconds(msDuration)} \n > **Reason** - ${reason}`)
    .setColor('White')

  const updateEmbed = new EmbedBuilder()
    .setDescription(`> ${mentionable} timeout updated for ${prettyMilliseconds(msDuration)} \n > **Reason** - ${reason}`)
    .setColor('White')

    if (mentionable.isCommunicationDisabled()) {
      await mentionable.timeout(msDuration, reason).then(async () => {
        mentionable.send({
          content: `From **${interaction.guild.name}**`,
          embeds: [updateEmbed]
        }).catch(async (e) => {
          return
        })
      })
      await interaction.editReply({
        embeds: [updateEmbed]
      });
      return;
    }
    
    await mentionable.timeout(msDuration, reason).then(async () => {
      mentionable.send({
        content: `From **${interaction.guild.name}**`,
        embeds: [embed]
      }).catch(async (e) => {
        return
      })
    })
    await interaction.editReply({
      embeds: [embed]
    });
  } catch (error) {

    return console.log(`There was an error when timing out: ${error}`);
  }
}
