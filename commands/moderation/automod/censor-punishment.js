const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ComponentType,  StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const censorConfig = require("../../../models/moderation/automod/censorConfig");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('censor-punishment')
    .setDescription('Change the censor punishment')
    .setDMPermission(false),
    run: async ({ interaction }) => {
        const punishmentMenu = new StringSelectMenuBuilder()
        .setCustomId('censor-punishment-menu')
        .setPlaceholder('Select the censor punishment')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel('Timeout')
            .setDescription('Set censor punishment to timeout')
            .setValue('timeout'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Kick')
            .setDescription('Set censor punishment to kick')
            .setValue('kick'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Ban')
            .setDescription('Set censor punishment to ban')
            .setValue('ban'),
        )


        const isCensorEnabled = await censorConfig.findOne({
            guildId: interaction.guild.id
        }).catch(async(e)=>{
            console.error(e)
            return await interaction.reply({
                content: 'Hey, its looks like some error occured, try again later',
                ephemeral: true
            })
        })

        if (!isCensorEnabled) {
            return await interaction.reply({
                content: 'Please first add censor words using `/add-censor-words`',
                ephemeral: true
            })
        }

        const row = new ActionRowBuilder().addComponents(punishmentMenu)

        const response = await interaction.reply({
            content: 'Configure censor punishments below',
            components: [row]
        })

        const collectorFilter = (i) => i.user.id == interaction.user.id

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: collectorFilter,
            time: 120_000,
          });

          collector.on('collect', async (i) => {
            switch (i.values[0]) {
                case 'timeout':
                    await censorConfig.updateOne({
                        guildId: interaction.guild.id,
                        censorPunishment: 'Timeout'
                    }).then(async()=>{
                        await i.reply({
                            content: 'Changed the censor punishment',
                            ephemeral: true
                        })
                        return;
                    }).catch(async(e)=>{
                        console.error(e)
                        await i.reply({
                            content: 'DB Error, try again later',
                            ephemeral: true
                        })
                    })
                    
                    break;

                    case 'kick':
                    
                    await censorConfig.updateOne({
                        guildId: interaction.guild.id,
                        censorPunishment: 'Kick'
                    }).then(async()=>{
                        return await i.reply({
                            content: 'Punishment changed to kick',
                            ephemeral: true
                        })
                    }).catch(async(e)=>{
                        console.error(e)
                        await i.reply({
                            content: 'DB Error, try again later',
                            ephemeral: true
                        })
                        return;
                    })
                    break;

                    case 'ban':
                    
                    await censorConfig.updateOne({
                        guildId: interaction.guild.id,
                        censorPunishment: 'Ban'
                    }).then(async()=>{
                        return await i.reply({
                            content: 'Punishment changed to ban',
                            ephemeral: true
                        })
                    }).catch(async(e)=>{
                        console.error(e)
                        await i.reply({
                            content: 'DB Error, try again later',
                            ephemeral: true
                        })
                        return;
                    })
            
                    break;
                    


                }


          })
    },

    options: {
        devOnly: true,
    }
}