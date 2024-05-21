import { Schema, model } from 'mongoose'

const aiConfig = new Schema({
    guildId: String,
    aiModel: {
        type: String,
        default: 'chat-gpt'
    },
    channel: String,
})

export default model('aiConfig', aiConfig)