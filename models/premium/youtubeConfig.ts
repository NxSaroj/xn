import { Schema, model } from 'mongoose'

const youtubeConfig = new Schema({
    guildId: {
        type: String,
        required: true
    }, 
    channelId: {
        type: [String],
        required: String,
    }, 
    customMessage: {
        type: String,
        required: true
    }, 
    messageChannel: {
        type: String,
        required: true,
    }, 
    lastUpdated: {
        type: Date,
        required: true
    },
    lastUpdatedVideo: {
        type: {
            id: {
                type: String,
                required: true
            }, 
            pubDate: {
                type: Date,
                required: true
            }
        }, 
        required: false,
    }
})

export default model('youtubeConfig', youtubeConfig)