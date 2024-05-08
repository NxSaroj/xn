const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const triggerConfig = require("../../../models/misc/tags/triggerConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-trigger")
    .setDescription("Create a trigger for the guild")
    .addStringOption((option) =>
      option
        .setName("trigger-name")
        .setDescription("The name of the trigger, case sensitive")
        .setRequired(true)
    )
    .setDMPermission(false),
  run: async ({ interaction }) => {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        return await interaction.reply({
            content: 'You dont have `Moderate Member(s)` powers to execute this command',
            ephemeral: true,
        })
    }
    const triggerName = interaction.options.getString("trigger-name");


    try {
        const triggerGuild = interaction.guild.id;

        const lengthTrigger = await triggerConfig.find({
            guildId: triggerGuild
        })
    
        if (lengthTrigger.length >= 10) {
            return await interaction.reply({
                content: 'Trigger creation limit has been reached\n Try patreon to increase the limit',
                ephemeral: true
            })
        }
    
    } catch (e) {
        console.error(`Error in ${__filename} \n ${e}`)
    }

    const isTriggerCreated = await triggerConfig.findOne({
      triggerName: triggerName,
      guildId: interaction.guild.id
    });

    if (isTriggerCreated) {
      const triggerDBName = isTriggerCreated.triggerName;
      const triggerDBContent = isTriggerCreated.triggerContent;

      const modal = new ModalBuilder()
        .setCustomId("trigger-modal")
        .setTitle("Add Trigger");

      const nameInput = new TextInputBuilder()
        .setCustomId("trigger-name")
        .setValue(triggerDBName.toString())
        .setLabel("Trigger Name")
        .setStyle(TextInputStyle.Short);

      const contentInput = new TextInputBuilder()
        .setCustomId("trigger-content")
        .setValue(triggerDBContent.toString())
        .setLabel("Trigger Content")
        .setPlaceholder(
          "You can use plcaeholders here join the support server for help"
        )
        .setStyle(TextInputStyle.Paragraph);

      const row1 = new ActionRowBuilder().addComponents(nameInput);
      const row2 = new ActionRowBuilder().addComponents(contentInput);

      modal.addComponents(row1, row2);

      try {
        await interaction.showModal(modal);
      } catch (e) {
        console.error(`Error in ${__filename} \n ${e}`)
      }

        }

        const modal = new ModalBuilder()
        .setCustomId("trigger-modal")
        .setTitle("Add Trigger");

      const nameInput = new TextInputBuilder()
        .setCustomId("trigger-name")
        .setLabel("Trigger Name")
        .setValue(triggerName)
        .setStyle(TextInputStyle.Short);

      const contentInput = new TextInputBuilder()
        .setCustomId("trigger-content")
        .setLabel("Trigger Content")
        .setPlaceholder(
          "You can use plcaeholders here join the support server for help"
        )
        .setStyle(TextInputStyle.Paragraph);

      const row1 = new ActionRowBuilder().addComponents(nameInput);
      const row2 = new ActionRowBuilder().addComponents(contentInput);

      modal.addComponents(row1, row2);



      try {
        await interaction.showModal(modal)
        
      } catch (e) {
        console.error(`Error in ${__filename} \n ${e}`)
      }

  },


};
