// const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
// const premiumGuildConfig = require('../../models/premium-guild-Config');
// const aiConfig = require('../../models/aiConfig')
// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName('activate-ai')
//     .setDescription('Activate the chatbot in your server')
//     .setDMPermission(false),
//     run: async ({ interaction }) => {

//         if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
//             return await interaction.reply({
//                 content: 'You need to have `Administrator` permissions to execute this command',
//                 ephemeral: true
//             })
//         }

//         const isGuildPremium = await premiumGuildConfig.findOne({
//             guildId: interaction.guild.id
//         }).catch(async e => {
//             console.error(e)
//             return await interaction.reply({
//                 content: 'DB Error, try again later',
//                 ephemeral: true
//             })
//         })

//         const nopremiumEmbed = new EmbedBuilder()
//         .setDescription(`> <:wrong:1211166597297733713> **This command is patreon only** **Don't worry you can buy our patreon membership to unlock this command**`)
//         .setColor('White')

//         if (!isGuildPremium) {
//             return await interaction.reply({
//                 embeds: [nopremiumEmbed]
//             }) 
//         }
//         const modelsCommand = '`/models`'
//         const activatedAi = new EmbedBuilder()
//         .setDescription(`> <:xn_tick:1209742516832706642> **AI Models activated, Run ${modelsCommand}** to change ai models`)
//         .setColor('White')

//        try {
//         await aiConfig.create({
//             guildId: interaction.guild.id,
//         })
//         await interaction.reply({
//             embeds: [activatedAi]
//         })
//        } catch (e) {
//         return console.error(e)
//        }
//     },
//     options: {
//         devOnly: true
//     }
// }