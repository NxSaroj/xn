import { Schema, model } from 'mongoose'

const stickyConfig = new Schema({
    userId: String,
    guildId: String,
    roles: {
        type: [String],
        default: []
    }
})

export default model('stickyConfig', stickyConfig)