import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} from 'discord.js'
import logsConfig from "../../../models/moderation/logs/logsConfig"

export const data =  new SlashCommandBuilder()
.setName("add-log-channel")
.setDescription("Add a channel for logging")
.addChannelOption((option) =>
  option
    .setName("channel")
    .setDescription("The channel for logging")
    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setRequired(true)
)
.setDMPermission(false)

export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
  if (!interaction.inCachedGuild()) return
  const channel = interaction.options.getChannel("channel");
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {
    return await interaction.reply({
      content:
        "**Required permissions** <:xn_arrow:1206238725130952755> `Administrator`",
      ephemeral: true,
    });
  }

  await interaction.deferReply();
  const guildConfigration = await logsConfig.findOne({
    guildId: interaction.guild.id,
  });
  const isChannelConfigured = await logsConfig.findOne({
    channelId: channel?.id,
  });

  try {
    if (guildConfigration) {
      return await interaction.editReply({
        content:
          "Logs configration has already been setup in the guild, \n Run `/remove-log-channel` to disable log channel",
      });
    } else if (isChannelConfigured) {
      return await interaction.editReply({
        content: `${channel} Is already been setup-as logs channel`,
      });
    } else {
      try {
        await logsConfig
          .create({
            channelId: channel?.id,
            guildId: interaction.guild.id,
          })
          .then(async () => {
            const embed = new EmbedBuilder()
              .setDescription(
                `> **Logs Channel Added** <:xn_arrow:1206238725130952755> ${channel}`
              )
              .setColor("White");
            await interaction.editReply({
              embeds: [embed],
            });
            return;
          });
      } catch (err) {
        console.error(__filename, err);
      }
    }
  } catch (err) {
    console.error(__filename, err);
  }
}
