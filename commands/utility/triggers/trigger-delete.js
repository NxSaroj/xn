const {
    SlashCommandBuilder,
    PermissionsBitField,

  } = require("discord.js");
  const triggerConfig = require("../../../models/misc/tags/triggerConfig");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("delete-trigger")
      .setDescription("delete a trigger for the guild")
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

      const guildTriggersConfig = await triggerConfig.findOne({
        guildId: interaction.guild.id
      })
      


      if (!guildTriggersConfig) {
        return await interaction.reply({
            content: 'No triggers has been found for the guild \n create a trigger using `/create-trigger`',
            ephemeral: true,
        })
      }
      const triggerName = interaction.options.getString("trigger-name");


  
      const isTriggerCreated = await triggerConfig.findOne({
        triggerName: triggerName,
      });

      




      if (!isTriggerCreated) {
        return await interaction.reply({
            content: 'No trigger found for that name, \n **Triggers are case sensitive**',
            ephemeral: true
        })
      }

      const contents = isTriggerCreated.triggerContent
      if (!contents) return;

      try {
        await triggerConfig.deleteMany({
            triggerName: triggerName,
            guildId: interaction.guild.id
        }).then(async()=>{
            return await interaction.reply({
                content: `${triggerName} Has been delete from this guild`,
                ephemeral: true
            })
        }).catch(async(e)=>{
            console.error(e)
            return await interaction.reply({
                content: 'DB Error, Try again later',
                ephemeral: true,
            })
        })
      } catch (e) {
        console.error(`Error in ${__filename} \n ${e}`)
        return await interaction.reply({
            content: `Error while deleting the trigger, try again later`,
            ephemeral: true
        })
      }
  
  
  
    },

  };
  