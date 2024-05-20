const { Schema, model } = require('mongoose');

const aiConfig = new Schema({
    guildId: String,
    aiModel: {
        type: String,
        default: 'chat-gpt'
    },
    channel: String,
})

module.exports = model('aiConfig', aiConfig)