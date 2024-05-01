const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder,  } = require('discord.js');
const linkOnlyConfig = require('../../models/misc/link-channel-config')
module.exports = {
    data: {
        name: 'add-linkonly', 
        description: 'A channel where only links are allowed', 
        options: [
            {
                name: 'channel', 
                description: 'The channel to make link only', 
                type: ApplicationCommandOptionType.Channel,
                channel_types: [0, 5],
                required: true
            }
        ], 
        dm_permission: false
    }, 
    run: async ({ interaction }) => {
        if (
            !interaction.member.permissions.has(
              PermissionsBitField.Flags.ManageChannels
            )
          ) {
            return await interaction.reply({
              content:
                "**Required permissions** <:xn_arrow:1206238725130952755> `Manage Channel(s)`",
              ephemeral: true,
            });
          }
        
        const isLinkOnlyEnabled = await linkOnlyConfig.findOne({
            guildId: interaction.guild.id
        }).catch((err)=>{ return console.error(err) })

        if (isLinkOnlyEnabled) {
            return await interaction.reply({
                content: `1 Channel Is already configured as link only channel \n You can't add more rn`,
                ephemeral: true
            })
        }
          const channel = interaction.options.getChannel('channel')  

        if (!channel) {
            return await interaction.reply({
                content: "Please input a vaild channel", 
                ephemeral: true
            })
        }

        try {
            const embed = new EmbedBuilder()
            .setDescription(
                `> **Link Only Channel Added** <:xn_arrow:1206238725130952755> ${channel}`
            )
            .setColor('White')
            await linkOnlyConfig.create({
                channelId: channel.id,
                guildId: interaction.guild.id
            }).catch(async(err)=>{
                console.error(err)
                return await interaction.reply({
                    content: "DB Error, Try again later",
                    ephemeral: true
                })
            })
            await interaction.reply({
                embeds: [embed]
            })
        } catch (err) {
            console.error(`Error in ${__filename} \n ${err}`)
            await interaction.reply({
                content: "Error occured, Try again later",
                ephemeral: true
            })
            return;
        }


    }
}