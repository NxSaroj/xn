const { Events } = require('discord.js'); 

module.exports = {
    name: Events.ShardDisconnect,
    async execute(shard) {
        console.log(`${shard.id} Has been disconnected`);
    }
}