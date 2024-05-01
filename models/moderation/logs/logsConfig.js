const { Schema, model } = require('mongoose')

const logsConfig = new Schema({
    channelId: String,
    guildId: String,
})

module.exports = model('logsConfig', logsConfig)