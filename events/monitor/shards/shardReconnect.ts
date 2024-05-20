import { Events, Shard } from 'discord.js'

export default {
    name: Events.ShardReconnecting,
    async execute(shard:any) {
        console.log(`${shard} Is Connecting`);
    }
}