const { Schema, model } = require('mongoose')

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

module.exports = model('welcomeConfig', welcomeConfigSchema)