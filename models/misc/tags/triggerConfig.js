const { Schema, model } = require('mongoose')

const triggerConfig = new Schema({
    triggerName: [String],
    triggerContent: String,
    guildId: String,
})

module.exports = model('triggerConfig', triggerConfig)