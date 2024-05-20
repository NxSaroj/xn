import { Schema, model } from 'mongoose'

const tagConfig = new Schema({
    tagName: {
        type: String,
        required: true
    }, 

    tagContent: {
        type: String,
        required: true
    }, 

    guildId: {
        type: String,
        required: true
    }, 
})

export default model('tagConfig', tagConfig)