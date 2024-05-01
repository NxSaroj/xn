const { Events } = require('discord.js'); 
const { error } = require('node:console')
module.exports = {
    name: Events.Warn,
    execute(w) {
        error(`Warning: \n ${w}`)
    }
    
}