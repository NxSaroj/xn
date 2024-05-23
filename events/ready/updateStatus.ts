const { Events, Client } = require('discord.js')
module.exports = {
    name: Events.ClientReady, 
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        client.user.setPresence(`shard ${client.shard.ids[0]}`)
    }
}