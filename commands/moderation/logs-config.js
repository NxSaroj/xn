const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js')
const { emojis } = require('../../utilities/json/config.json')
const { logsConfigRow } = require('../../utilities/select-menu/logConfigMenu')
const logsConfig = require("../../models/moderation/logs/logsConfig");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('logs-config')
    .setDescription('Check the log configration of the guild')
    .setDMPermission(false),
    /**
     * 
     * @param {import('commandkit').SlashCommandProps} param0 
     * @returns 
     */
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
        const embed = {
            color: 0xFFFFFF,
            author: {
                name: `${interaction.guild.name}`,
                icon_url: interaction.guild.iconURL(),
            },
            fields: [
                { name: `Message Logs`, value: `${guildConfig.messageLog ? emojis.xn_tick : emojis.xn_wrong}`, inline: false },
                { name: `Channel Logs`, value: `${guildConfig.channelLog ? emojis.xn_tick : emojis.xn_wrong}`, inline: false },
                { name: `Join Leave Logs`, value: `${guildConfig.welcomeLog ? emojis.xn_tick : emojis.xn_wrong}`, inline: false },
            ]
        }
        const response = await interaction.reply({ embeds: [embed], components: [logsConfigRow] })
        const collector =   response.createMessageComponentCollector({
            filter: (i) => i.user.id == interaction.user.id, 
            time: 240_000, 
            componentType: ComponentType.StringSelect
        })
        collector.on('collect', async (i) => {
            switch (i.values[0]) {
                
            }
        })
    } catch (err) {
        console.log(`Error in ${__filename} \n ${err}`)
        return await interaction.reply({
            content: 'Logs has not been configured for this server \n Run `/add-log-channel` to add a log channel',
            ephemeral: true
        })
    }
    },


}