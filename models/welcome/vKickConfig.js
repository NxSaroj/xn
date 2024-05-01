const { Schema, model } = require('mongoose');

const vKickConfig = new Schema({
    userId: String,
    guildId: String,
})

module.exports = model('vKickConfig', vKickConfig)