const { Schema, model } = require('mongoose')

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

module.exports = model('spotlightConfig', spotlightConfig)