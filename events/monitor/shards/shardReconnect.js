const { Events } = require('discord.js'); 

module.exports = {
    name: Events.ShardReconnecting,
    async execute(shard) {
        console.log(`${shard.id} Is Connecting`);
    }
}