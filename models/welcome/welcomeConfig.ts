import { Schema, model } from 'mongoose'

const welcomeConfig = new Schema({
    guildId: {
        type: String,
        required: true
    }, 
    channelId: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String
    },
    welcomeEmbed: {
        type: Object
    }
})

export default model('welcomeConfig', welcomeConfig)