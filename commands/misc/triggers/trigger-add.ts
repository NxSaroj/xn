import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import triggerConfig from "../../../models/misc/tags/triggerConfig"
import premiumGuildConfig from "../../../models/premium/premium-guild-Config"

export const data = new SlashCommandBuilder()
.setName("create-trigger")
.setDescription("Create a trigger for the guild")
.addStringOption((option) =>
  option
    .setName("trigger-name")
    .setDescription("The name of the trigger, case sensitive")
    .setRequired(true)
)
.setDMPermission(false)


export async function run ({ interaction }: import('commandkit').SlashCommandProps) {
if (!interaction.inCachedGuild()) return;

if (!interaction.memberPermissions.has("ManageMessages")) {
  return await interaction.reply({
    content: "You need to have `Manage Message` Permission to execute this command",
    ephemeral: true
  })
}

const triggerName = interaction.options.getString("trigger-name");

try {
const triggerGuild = interaction.guild.id;

const lengthTrigger = await triggerConfig.find({
  guildId: triggerGuild,
});

const isPremiumGuild = await premiumGuildConfig.findOne({
  guildId: triggerGuild,
});

if (!isPremiumGuild) {
  if (lengthTrigger.length >= 10) {
    return await interaction.reply({
      content:
        "Trigger creation limit has been reached\n Try patreon to increase the limit",
      ephemeral: true,
    });
  }
} else if (lengthTrigger.length >= 35) {
  return await interaction.reply({
    content:
      "Trigger creation limit has been reached\n Try patreon to increase the limit",
    ephemeral: true,
  });
}
} catch (e) {
console.error(`Error in ${__filename} \n ${e}`);
}

const isTriggerCreated = await triggerConfig.findOne({
triggerName: triggerName,
guildId: interaction.guild.id,
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

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);

modal.addComponents(row1, row2);

try {
  await interaction.showModal(modal);
} catch (e) {
  console.error(`Error in ${__filename} \n ${e}`);
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

const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);

modal.addComponents(row1, row2);

try {
await interaction.showModal(modal);
} catch (e) {
console.error(`Error in ${__filename} \n ${e}`);
}
}
