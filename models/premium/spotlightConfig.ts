import { Schema, model } from 'mongoose'

const spotlightConfig = new Schema({ 
    userId: {
        type: String,
    }, 
    spotlightWord: {
        type: [String]
    }, 
    guildId: {
        type: String,
        required: true
    }
})

export default model('spotlightConfig', spotlightConfig)