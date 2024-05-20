import { Schema, model } from 'mongoose'

const guildConfig = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    }
})

export default model('guildConfig', guildConfig)