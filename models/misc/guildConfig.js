const { Schema, model } = require('mongoose')

const guildConfig = new Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    }
})

module.exports = model('guildConfig', guildConfig)