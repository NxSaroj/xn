import { Schema, model } from 'mongoose'

const linkOnlyConfig = new Schema({
    channelId: String,
    guildId: String
})

export default model('linkOnlyConfig', linkOnlyConfig)