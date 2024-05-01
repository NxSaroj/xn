// const { Events } = require("discord.js");
// const { RsnChat } = require("rsnchat");
// const aiConfig = require("../models/aiConfig");
// require("dotenv").config();

// const rsnchat = new RsnChat(`${process.env.RSN_API}`);
// const cooldowns = new Map()
// const cooldown = 10_000
// const now = Date.now()

// module.exports = {
//   name: Events.MessageCreate,
//   async execute(message, client) {
//     const isAiEnabled = await aiConfig.findOne({
//       guildId: message.guild.id,
//     });

//     const aiModel = isAiEnabled.aiModel;

//     if (!isAiEnabled) return;

//     if (
//       !message.content.startsWith(`<@${client.user.id}>`)
//     )
//       return;
//     switch (aiModel) {
//       case "chat-gpt":
//         if (cooldowns.has(message.author.id)) {
//           const expirationTime = cooldowns.get(message.author.id) + cooldown;
    
//           if (now < expirationTime) {
//             const timeLeft = (expirationTime - now) / 1000;
//             return message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`);
//           }
//         }
//         const chatGptreply = await message.channel.send(
//           `<a:xnloading:1215684256534233098 Generating the response`
//         );
//         rsnchat
//           .gpt(message.content)
//           .then(async (response) => {
//             await chatGptreply.edit({
//               content: `${response.message}`,
//             });
//           })
//           .catch(async (e) => {
//             await chatGptreply.edit({
//               content: "Api error, try again later",
//             });
//             return console.error(e);
//           });
//           cooldowns.set(message.author.id, now);
//         setTimeout(() => cooldowns.delete(message.author.id), cooldown);
//         break;
//       case "gemini":
//         if (cooldowns.has(message.author.id)) {
//           const expirationTime = cooldowns.get(message.author.id) + cooldown;
    
//           if (now < expirationTime) {
//             const timeLeft = (expirationTime - now) / 1000;
//             return message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`);
//           }
//         }

//         const geminiReply = await message.channel.send(
//           `<a:xnloading:1215684256534233098 Generating the response`
//         );
//         rsnchat
//           .gemini(message.content)
//           .then(async (response) => {
//             await geminiReply.edit({
//               content: `${response.message}`,
//             });
//           })
//           .catch(async (e) => {
//             await geminiReply.edit({
//               content: "Api error, try again later",
//             });
//             return console.error(e);
//           });

//           cooldowns.set(message.author.id, now);
//           setTimeout(() => cooldowns.delete(message.author.id), cooldown);
//         break;
//       case "codellama":

//       if (cooldowns.has(message.author.id)) {
//         const expirationTime = cooldowns.get(message.author.id) + cooldown;
  
//         if (now < expirationTime) {
//           const timeLeft = (expirationTime - now) / 1000;
//           return message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`);
//         }
//       }


//         const codellamaReply = await message.channel.send(
//           `<a:xnloading:1215684256534233098 Generating the response`
//         );
//         rsnchat
//           .codellama(message.content)
//           .then(async (response) => {
//             await codellamaReply.edit({
//               content: `${response.message}`,
//             });
//           })
//           .catch(async (e) => {
//             await codellamaReply.edit({
//               content: "Api error, try again later",
//             });
//             return console.error(e);
//           });

//           cooldowns.set(message.author.id, now);
//           setTimeout(() => cooldowns.delete(message.author.id), cooldown);
//         break;
//     }
//   },
// };
