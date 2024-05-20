import { Events, Shard } from 'discord.js'

export default {
    name: Events.ShardDisconnect,
    async execute(shard:any) {
        console.log(`${shard} Has been disconnected`);
    }
}