import { EmbedBuilder, PermissionsBitField } from 'discord.js'
import type { CommandData, SlashCommandProps } from 'commandkit';
import linkOnlyConfig from '../../models/misc/link-channel-config'

export const data:CommandData = {
    name: 'disable-link-only', 
    description: 'Disable the link only channel',
    dm_permission: false
}

export async function run ({ interaction }: SlashCommandProps) {
    if (!interaction.inCachedGuild()) return
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
            content:
              "**Required permissions** <:xn_arrow:1206238725130952755> `Manage Channel(s)`",
            ephemeral: true,
          });
    }

    const isLinkOnlyEnabled = await linkOnlyConfig.findOne({
        guildId: interaction.guild.id
    }).catch((err)=>{ return console.error(err) })
    if (!isLinkOnlyEnabled) {
        return await interaction.reply({
            content: "Nothing changed, As there is no link only channel",
            ephemeral: true
        })
    }

    try {
        await linkOnlyConfig.deleteMany({
            guildId: interaction.guild.id
        }).then(async()=>{
            const embed = new EmbedBuilder()
            .setDescription(
                `> **Link Only Channel Disabled** <:xn_arrow:1206238725130952755> <#${isLinkOnlyEnabled.channelId}>`
            )
            .setColor('White')
            await interaction.reply({
                embeds: [embed]
            })
        }).catch(async(err)=>{
            console.error(err) 
            return await interaction.reply({
                content: "DB Error, Try Again Later",
                ephemeral: true
            })
        })
    } catch (err) {
        return console.error(`Error in ${__filename} \n ${err}`)
    }
}