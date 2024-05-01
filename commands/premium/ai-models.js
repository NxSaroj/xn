// const {
//   SlashCommandBuilder,
//   ActionRowBuilder,
//   ComponentType,
//   StringSelectMenuBuilder,
//   StringSelectMenuOptionBuilder,
//   PermissionsBitField,
// } = require("discord.js");
// const aiConfig = require("../../models/aiConfig");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("ai-models")
//     .setDescription("Change the guild ai model")
//     .setDMPermission(false),
//   run: async ({ interaction }) => {
//     if (
//       !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
//     ) {
//       return await interaction.reply({
//         content:
//           "You need `Manage Guild(s)` permissions to execute this command",
//         ephemeral: true,
//       });
//     }

//     const modelsMenuBuilder = new StringSelectMenuBuilder()
//       .setCustomId("ai-models-builder")
//       .setPlaceholder("Select your AI Model")
//       .addOptions(
//         new StringSelectMenuOptionBuilder()
//           .setValue("chat-gpt")
//           .setDescription("Change your ai model to gpt")
//           .setLabel("GPT"),
//         new StringSelectMenuOptionBuilder()
//           .setValue("gemini")
//           .setDescription("Change your ai model to gemini")
//           .setLabel("GEMINI"),
//         new StringSelectMenuOptionBuilder()
//           .setValue("codellama")
//           .setDescription("Change your ai model to codellama")
//           .setLabel("CODE-LLAMA")
//       );

//     const row = new ActionRowBuilder().addComponents(modelsMenuBuilder);

//     const response = await interaction.reply({
//       content: "YAYA, Change your AI Models below",
//       components: [row],
//     });

//     const collectorFilter = (i) => i.user.id == interaction.user.id;

//     const collector = response.createMessageComponentCollector({
//       componentType: ComponentType.StringSelect,
//       filter: collectorFilter,
//       time: 60_0000,
//     });

//     collector.on("collect", async (i) => {
//       try {
//         switch (i.values[0]) {
//           case "chat-gpt":
//             await aiConfig
//               .updateOne({
//                 guildId: interaction.guild.id,
//                 aiModel: "chat-gpt",
//               })
//               .then(async () => {
//                 await i.reply({
//                   content: "Changed the ai model to **Chat GPT**",
//                   ephemeral: true,
//                 });
//               })
//               .catch(async (e) => {
//                 console.error(e);
//                 return await i.reply({
//                   content: "DB Error, try again later",
//                   ephemeral: true,
//                 });
//               });
//             break;

//           case "gemini":
//             await aiConfig
//               .updateOne({
//                 guildId: interaction.guild.id,
//                 aiModel: "gemini",
//               })
//               .then(async () => {
//                 await i.reply({
//                   content: "Changed the ai model to **Gemini**",
//                   ephemeral: true,
//                 });
//               })
//               .catch(async (e) => {
//                 console.error(e);
//                 return await i.reply({
//                   content: "DB Error, try again later",
//                   ephemeral: true,
//                 });
//               });
//             break;

//           case "codellama":
//             await aiConfig
//               .updateOne({
//                 guildId: interaction.guild.id,
//                 aiModel: "codellama",
//               })
//               .then(async () => {
//                 await i.reply({
//                   content: "Changed the ai model to **Code Llama**",
//                   ephemeral: true,
//                 });
//               })
//               .catch(async (e) => {
//                 console.error(e);
//                 return await i.reply({
//                   content: "DB Error, try again later",
//                   ephemeral: true,
//                 });
//               });
//             break;
//         }
//       } catch (e) {
//         console.error(e);
//         return;
//       }
//     });
//   },
//   options: {
//     devOnly: true
//   }
// };
