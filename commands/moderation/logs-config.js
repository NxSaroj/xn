const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const logsConfig = require("../../models/moderation/logs/logsConfig");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('logs-config')
    .setDescription('Check the log configration of the guild')
    .setDMPermission(false),
    run: async ({ interaction }) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: '> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`',
                ephemeral: true
            });
        }

        const removeChannel = new ButtonBuilder()
        .setCustomId('remove-channel')
        .setLabel('Remove log channel')
        .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(removeChannel)
        const guildConfig = await logsConfig.findOne({ guildId: interaction.guild.id })
    try {
        if (!guildConfig) {
            return await interaction.reply({
                content: 'Logs has not been configured for this server \n Run `/add-log-channel` to add a log channel',
                ephemeral: true
            })
        } else {

            await interaction.deferReply()
            const { guild } = interaction;

            let channel =
            interaction.guild.channels.cache.get(guildConfig.channelId) ||
            "`Channel deleted`";  

            const embed = new EmbedBuilder() 
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ size: 256 }) })
            .setColor('White')
            .setDescription(`\n\n > **Logs Channel** <:xn_arrow:1206238725130952755> ${channel}`)

            try {
            const response = await interaction.editReply({
                    embeds: [embed],
                    components: [row]
                })
                const collectorFilter = i => i.user.id === interaction.user.id;
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter });
                if (confirmation.customId === 'remove-channel') {
                    await logsConfig.findOneAndDelete({ guildId: interaction.guild.id, channelId: guildConfig.channelId }).then(async()=>{
                        return await interaction.followUp({
                            content: `${channel} Has been removed from logs`,
                            ephemeral: true
                        })
                    })

                }
            } catch (err) {
                console.log(`Error in ${__filename} \n ${err}`)
            }
            
        }
    } catch (err) {
        console.log(`Error in ${__filename} \n ${err}`)
        return await interaction.reply({
            content: 'Logs has not been configured for this server \n Run `/add-log-channel` to add a log channel',
            ephemeral: true
        })
    }
    },


}