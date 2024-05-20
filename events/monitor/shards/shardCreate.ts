import { Events, Shard } from 'discord.js'

export default {
    name: Events.ShardReady,
    async execute(shard:any) {
        console.log(`${shard} Is ready`);
    }
}