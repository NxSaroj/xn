import { Schema, model } from 'mongoose';
const { randomUUID } = require('crypto')
const suggestionConfig = new Schema({
    suggestionId: {
        type: String,
        default: randomUUID
    },
    authorId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pendig'
    },

})

export default model('suggestionConfig', suggestionConfig)