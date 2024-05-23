import { Events } from 'discord.js'

export default {
    name: Events.Error, 
    execute(m) {
        console.error(`Events Error: \n ${m} \N T`)
    }
}