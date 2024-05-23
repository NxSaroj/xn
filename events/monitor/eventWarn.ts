import { Events } from 'discord.js'
import { error } from 'node:console'
export default {
    name: Events.Warn,
    execute(w:any) {
        error(`Warning: \n ${w}`)
    }
    
}