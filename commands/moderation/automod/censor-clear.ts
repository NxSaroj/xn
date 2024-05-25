import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField }  from 'discord.js'
import censorConfig from '../../../models/moderation/automod/censorConfig'

export const data = new SlashCommandBuilder()
.setName('censor-clear')
.setDescription('Clear all the censor words of the guild')
.setDMPermission(false)

export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
    if (!interaction.inCachedGuild()) return
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You need to have `Moderate Member(s)` permissions to execute this command',
            ephemeral: true
        })
    }

    const isCensorEnabled = await censorConfig.findOne({
        guildId: interaction.guild.id,
    })

    if (!isCensorEnabled) {
        return await interaction.reply({
            content: `Censor system has not been configured for the guild`,
            ephemeral: true
        })
    } else {
        await censorConfig.deleteMany({
            guildId: interaction.guild.id
        }).then(async()=>{
            return await interaction.reply({
                content: 'Deleted all the data of censor words',
                ephemeral: true
            }).catch(async(e)=>{
                console.error(e)
                return await interaction.reply({
                    content: 'DB Error, try again later',
                    ephemeral: true
                })
            })
        })
    }
}