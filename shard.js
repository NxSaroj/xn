const { ShardingManager } = require('discord.js')
require('dotenv').config()

const manager = new ShardingManager('./index.js', {
    totalShards: 'auto', 
    token: process.env.TOKEN
})

manager.on('shardCreate', (shard) => {
    console.log(`${shard.id} Has been launched`)
})


manager.spawn()