import type { CommandData, SlashCommandProps } from 'commandkit'
import {  EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } from 'discord.js'

export const data:CommandData = {
    name: 'change-nick', 
    description: "Modify discord member nickname", 
    options: [
        { name: 'user', description: "The user to modify nick", type: ApplicationCommandOptionType.User, required: true },
        { name: 'nick', description: "The nick to apply", type: ApplicationCommandOptionType.String, required: true },
    ]
}

export async function run ({ interaction }: SlashCommandProps) {
    if (!interaction.member) return;
    if (!interaction.guild) return;
    if (!interaction.inCachedGuild()) return await interaction.reply({ content: "This Guild Isn't Cached", ephemeral: true })
    try {
        if (!interaction?.memberPermissions?.has("ChangeNickname")) {
             await interaction.reply({
              content: 'You need `Change Nickname(s)` permissions to execute this command',
              ephemeral: true
            })
            return
          }
        const user = interaction.options.getMember('user')
        const nickname = interaction.options.getString('nick')
        if (!user) {
             await interaction.reply({
                content: "Please input a valid user", 
                ephemeral: true
            })
            return
        }


        const targetUserRolePosition = user.roles.highest.position
        const requestUserRolePosition = interaction.member.roles?.highest?.position; 
        const botRolePosition = interaction.guild.members?.me?.roles.highest.position; 
        if (!botRolePosition) return await interaction.reply({ content: "I don't have enough permissions", ephemeral: true })
        if (user?.id == interaction.guild.ownerId) {
            await interaction.reply({
                content: "I can't change bot owner nickname", 
            })
            return;
        }

        if (targetUserRolePosition >= requestUserRolePosition) {
          await interaction.editReply("You cant moderate that member");
          return;
        }
    
        if (targetUserRolePosition >= botRolePosition) {
          await interaction.reply("I cant moderate that member");
          return;
        }
    
        if (!interaction.guild.members.me?.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
            return await interaction.reply({
                content: "I don't have `Change NickName(s)` permissions to execute this command", 
                ephemeral: true
            })
        } 

        user.setNickname(nickname).then(async()=>{
            const updateEmbed = new EmbedBuilder()
            .setDescription(`> ${user} nickname has been updated to ${nickname}`)
            .setColor('White')
            await interaction.reply({
                embeds: [updateEmbed]
            })
        }).catch(async(err:any)=>{
            console.error(err)
            await interaction.reply({
                content: "Error occured while changing nickname, make sure i have right permissions and hierarchy",
                ephemeral: true
            })
            return;
        })
    } catch (err) {
        console.error(`Error in ${__filename} \n ${err}`)
        return;
    }

}