const { Events, Shard } = require('discord.js');

module.exports = {
    name: Events.ShardError, 
    /**
     * 
     * @param {Shard} shard 
     */
    execute(shard) {
        console.log(`Error in shard : ${shard.id}`)
    }
}