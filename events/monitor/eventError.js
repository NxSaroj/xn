const { Events } = require("discord.js");

module.exports = {
    name: Events.Error, 
    /**
     * 
     * @param {import("discord.js").ErrorEvent} m 
     */
    execute(m) {
        console.error(`Events Error: \n ${m} \N T`)
    }
}