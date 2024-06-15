import { SlashCommandBuilder,  PermissionsBitField, EmbedBuilder } from 'discord.js'
import stickyConfig from '../../../models/premium/stickyConfig'

export const data = new SlashCommandBuilder()
.setName('sticky-config')
.setDescription('Enable or disable sticky role for the guild')
.setDMPermission(false)

export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
    if (!interaction.inCachedGuild()) return
    if (!interaction.member?.permissions?.has(PermissionsBitField.Flags.ManageGuild)) {
        await interaction.reply({
            content: 'Required permissions > `Adminstrator(s)`',
            ephemeral: true
        })
    }


    const enableEmbed = new EmbedBuilder()
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 }) || undefined})
    .setColor('White')
    .setDescription(`> **Enabled The Sticky Roles**`)

    const disableEmbed = new EmbedBuilder()
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ size: 256 }) || undefined})
    .setColor('White')
    .setDescription(`> **Disabled The Sticky Roles**`)

    const isStickyConfigured = await stickyConfig.findOne({
        guildId: interaction.guild.id
    })

    if (isStickyConfigured) {
         stickyConfig.deleteMany({
            guildId: interaction.guild.id
        }).then(async()=>{
            await interaction.reply({
            embeds: [disableEmbed]
            })
            return;
        }).catch(async(e)=>{
            console.error(e)
            await interaction.reply({
                content: 'DB Error, try again later',
                ephemeral: true
            })
            return;
        })
    } else {
         stickyConfig.create({
            guildId: interaction.guild.id
        }).then(async()=>{
            return await interaction.reply({
                embeds: [enableEmbed]
            })
        }).catch(async(e)=>{
            console.error(e)
            await interaction.reply({
                content: 'DB Error, try again later',
                ephemeral: true
            })
        })
    } 
}