import type { SlashCommandProps, CommandData } from "commandkit";
import type { APIEmbed, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'
import { emojis } from '../../../utilities/json/config.json'

import welcomeConfig from '../../../models/welcome/welcomeConfig'

export const data:RESTPostAPIApplicationCommandsJSONBody = {
    name: 'welcome-config', 
    description: 'Manage the welcome module', 
    dm_permission: false,
}

export async function run({
    interaction, 
    client
}: SlashCommandProps) {



    const embed:APIEmbed = {
        author: {
            name: 'welcome-module', 
            icon_url: client.user.displayAvatarURL({ size: 256 })
        }, 
        footer: {
            text: `Requested by ${interaction.user.username}`, 
            icon_url: interaction.user.displayAvatarURL()
        }, 
        description: `**Welcome Module**\n\n > Enabled ${emojis.xn_arrow} `
    }

}