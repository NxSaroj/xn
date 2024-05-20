import { Events, Shard } from 'discord.js'

export default {
    name: Events.ShardError, 
    execute(shard:any) {
        console.log(`Error in shard : ${shard}`)
    }
}