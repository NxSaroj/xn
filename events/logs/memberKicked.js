// const { AuditLogEvent, Events, EmbedBuilder } = require('discord.js');
// const logsConfig = require('../../models/moderation/logs/logsConfig')


// module.exports = {
//     name: Events.GuildAuditLogEntryCreate, 
//     async execute (auditLog, client) {
//         const logs = await logsConfig.find()
//         for (const log of logs) {
//             const targetGuildId = log.guildId;
//             const isLogsConfigured = await logsConfig.findOne({
//                 guildId: targetGuildId
//             }).catch(err => { return console.error(err) })

//             if (!isLogsConfigured) return;
//             const targetGuild = client.guilds.cache.get(targetGuildId) || (
//                 await client.guilds.fetch(targetGuildId)
//             )
            
//             const channelId = isLogsConfigured.channelId;
//             const channel = targetGuild.channels.cache.get(channelId) || (
//                 await targetGuild.channels.fetch(channelId)
//             )
//             if (!channel) {
//                 await logsConfig.deleteMany({ guildId: targetGuildId }).catch(err => { return console.error(err) })
//             }
//             const { action, executorId, targetId } = auditLog;
//             if (action !== AuditLogEvent.MemberKick) return;
//             const executor = await client.users.fetch(executorId);
//             const kickedUser = await client.users.fetch(targetId);

//             try {
//                 const embed = new EmbedBuilder()
//                 .setAuthor({ name: kickedUser.tag, iconURL: kickedUser.displayAvatarURL({ size: 256 })})
//                 .setDescription(
//                     `**Member Kicked** \n\n > **Member** <:xn_arrow:1206238725130952755> ${kickedUser.tag} \n > **Moderator** <:xn_arrow:1206238725130952755> ${executor.tag} \n\n`
//                   )
//                   .setColor('White')
//                   await channel.send({ embeds: [embed] }).catch(err => { return })
//             } catch (err) {
//                 return;
//             }
//         }
//     }
// }