const { Schema, model } = require('mongoose');

const tagConfig = new Schema({
    tagName: {
        type: [String],
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

module.exports = model('tagConfig', tagConfig)