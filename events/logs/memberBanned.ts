// const { AuditLogEvent, Events, EmbedBuilder, Client } = require('discord.js');
// const logsConfig = require('../../models/moderation/logs/logsConfig')

// module.exports = {
//     name: Events.GuildAuditLogEntryCreate, 
//     /**
//      * 
//      * @param {AuditLogEvent} auditLog 
//      * @param {Client} client 
//      */
//     async execute (auditLog, client) {
//         const logs = await logsConfig.find()
//         logs.forEach(async log => {
//             const targetGuildId = log.guildId;
//             const isLogsConfigured = await logsConfig.findOne({
//                 guildId: targetGuildId
//             })
//             if (!isLogsConfigured) return;
//             const targetGuild = client.guilds.cache.get(log?.guildId)
//             const channel = targetGuild.channels.cache.get(isLogsConfigured.channelId)
//             if (!channel) {
//                 await logsConfig.deleteMany({ guildId: targetGuildId }).catch(err => { return console.error(err) })
//             }
//             const { action, executorId, targetId } = auditLog;
//             if (action !== AuditLogEvent.MemberBanAdd) return;
//             const executor = await client.users.fetch(executorId);
//             const kickedUser = await client.users.fetch(targetId);

//             try {
//                 const embed = new EmbedBuilder()
//                 .setAuthor({ name: kickedUser.tag, iconURL: kickedUser.displayAvatarURL({ size: 256 })})
//                 .setDescription(
//                     `**Member Banned** \n\n > **Member** <:xn_arrow:1206238725130952755> ${kickedUser.tag} \n > **Moderator** <:xn_arrow:1206238725130952755> ${executor.tag} \n\n`
//                   )
//                   .setColor('White')
//                   await channel.send({ embeds: [embed] }).catch(err => { return })
//             } catch (err) {
//                 return;
//             }
//         })
//     }
// }