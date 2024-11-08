import { Events, type ModalSubmitInteraction } from "discord.js";
import triggerConfig from "../../../models/misc/tags/triggerConfig";


export default {
  name: Events.InteractionCreate,
  run: async (interaction: ModalSubmitInteraction) => {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId == "trigger-modal") {
      const nameInput = interaction.fields.getTextInputValue("trigger-name");
      const contentInput =
        interaction.fields.getTextInputValue("trigger-content");
  
      const isTriggerCreated = await triggerConfig.findOne({
        triggerName: nameInput,
        guildId: interaction.guild.id,
      });
  
      if (isTriggerCreated) {
        try {
          await triggerConfig
            .findOneAndUpdate(
              { triggerName: nameInput, guildId: interaction.guild.id },
              { triggerContent: contentInput },
              { upsert: false }
            )
            .then(async () => {
              return await interaction.reply({
                content: `${nameInput} Trigger has been updated`,
              });
            });
        } catch (e) {
          console.error(`Error in file ${__filename} \n ${e}`);
          return await interaction.reply({
            content: "Error while updating trigger",
            ephemeral: true,
          });
        }
      } else {
        try {
          await triggerConfig
            .create({
              triggerName: nameInput,
              triggerContent: contentInput,
              guildId: interaction.guild.id,
            })
            .then(async () => {
              return await interaction.reply({
                content: `${nameInput} Trigger has been created`,
                ephemeral: true,
              });
            });
        } catch (e) {
          console.error(`Error in ${__filename} \n ${e}`);
        }
      }
    }
  }
}