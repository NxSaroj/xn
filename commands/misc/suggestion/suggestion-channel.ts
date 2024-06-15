import { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } from 'discord.js'
import guildConfig from '../../../models/misc/guildConfig'
import type { SlashCommandProps } from 'commandkit'

export const data = new SlashCommandBuilder()
.setName('suggestion-channel')
.setDescription('Add a suggestion channel')
.addChannelOption((option)=>option.setName('channel').setDescription('Channel for the accepting suggestion').addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
.setDMPermission(false)

async function run({ interaction }:SlashCommandProps) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
            content: "You need `Manage Channel(s)` permissions to execute this command",
            ephemeral: true
        })
    }

    const isSuggestionConfigured = await guildConfig.exists({
        guildId: interaction.guild.id
    })

    if (isSuggestionConfigured) {
        await interaction.reply({
            content: "Suggestion's has already been configured in this server \n You can manage them using `/config-suggestion`",
            ephemeral: true
        })
        return;
    }
    const channel = interaction.options.getChannel('channel');
    
    try {

        const suggestionCongiguredEmbed = new EmbedBuilder()
        .setDescription(`<:xn_tick:1209742516832706642> ${channel} Has been configured as suggestion channel`,)
        .setColor('White')
        

        await guildConfig.create({
            guildId: interaction.guild.id,
            channelId: channel?.id
        }).then(async()=>{
             await interaction.reply({
                embeds: [suggestionCongiguredEmbed]
            })
        }).catch(async (e)=>{
            console.error(e)
            await interaction.reply({
                content: "DB Error, Try again later",
                ephemeral: true
            })
            return;
        })
    } catch (err) {
        console.error(`Error in ${__filename} \n ${err}`)
        return;
    }

}