import { ShardingManager } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()

const manager = new ShardingManager('./index.js', {
    totalShards: 18, 
    token: process.env.TOKEN
})

manager.on('shardCreate', (shard) => {
    console.log(`${shard.id} Has been launched`)
})

manager.spawn()