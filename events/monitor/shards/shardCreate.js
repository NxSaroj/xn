const { Events } = require('discord.js'); 

module.exports = {
    name: Events.ShardReady,
    async execute(shard) {
        console.log(`${shard} Is ready`);
    }
}