const { Schema, model } = require('mongoose');

const linkOnlyConfig = new Schema({
    channelId: String,
    guildId: String
})

module.exports = model('linkOnlyConfig', linkOnlyConfig)