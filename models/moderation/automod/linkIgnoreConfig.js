const { Schema, model } = require('mongoose')

const linkIgnoreConfig = new Schema({
    roleId: String,
    guildId: String
})

module.exports = model('linkIgnoreConfig', linkIgnoreConfig)