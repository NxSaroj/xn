import { Schema, model } from 'mongoose'
const welcomeConfigSchema = new Schema({
    guildId: String,
    channelId: {
        type: String,
        unique: true
    },
    customMessage: {
        type: Array,
        default: [],
    },
    messageContent: {
        type: String,

    }
})

export default  model('welcomeConfig', welcomeConfigSchema)