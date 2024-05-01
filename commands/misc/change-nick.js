const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChatInputCommandInteraction } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Customize the member nickname')
    .addUserOption((option)=>option.setName('user').setDescription('The user to change nick').setRequired(true))
    .addStringOption((option)=>option.setName('nick').setDescription('The target name for the nick').setRequired(true))
    .setDMPermission(false),
    /**
     * 
     * @param {ChatInputCommandInteraction} param0 
     * @returns 
     */
    run: async ({ interaction, client,  }) => {

        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
                return await interaction.editReply({
                  content: 'You need `Change Nickname(s)` permissions to execute this command',
                  ephemeral: true
                })
              }
           const { options } = interaction
           const user = options.getMember('user')
            const nickname = interaction.options.getString('nick')
            if (!user) {
                return await interaction.reply({
                    content: "Please input a valid user", 
                    ephemeral: true
                })
            }
    

            const targetUserRolePosition = user.roles.highest.position;
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
        
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ChangeNickname)) {
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
            }).catch(async(err)=>{
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
}