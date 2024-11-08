import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import infoButtons from '../../models/utilities/info-buttons';
import axios from 'axios'
import { CommandOptions } from 'commandkit';
require('dotenv').config()

export const data =  new SlashCommandBuilder()
.setName('patron-status')
.setDescription('Check your patreon status')
.setDMPermission(false)

export async function run ({ interaction, client }: import('commandkit').SlashCommandProps) {
    if (!interaction.inCachedGuild()) return
    const noPatreonEmbed = new EmbedBuilder()
    .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 256 })
    })
    .setDescription("**Hello! We couldn't find any active Patreon memberships associated with your username. Don't worry, you can unlock our awesome commands by purchasing a membership using the buttons below. Join now for an enhanced experience**")
    .setColor('White')
    .setThumbnail(client.user.displayAvatarURL())
   .setFooter({
    text: `Requested by ${interaction.user.username}`,
    iconURL: interaction.user.displayAvatarURL({ size: 256 })
   })
   
   try {
    const apiEndpoint = "https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields%5Bmember%5D=patron_status,last_charge_status,currently_entitled_amount_cents&fields%5Buser%5D=vanity,full_name,image_url"
    axios.get(apiEndpoint, {
        headers: {
            Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`
        }
        
    }).then((response:any) => {
        console.log(response.data.data.relationships.memberships)
        console.log(typeof response)
    }).catch(err => {
        console.error(err.data)
        return;
    })
    await interaction.reply({
        content: "Check console", 
        ephemeral: true
    })
   } catch (e) {
    console.error(`Error in ${__filename} \n ${e}`)
    return;
   }
}

export const options:CommandOptions = {
    devOnly: true
}