const { Schema, model } = require('mongoose')

const autoroleConfig = new Schema({
    roleId: String,
    guildId: String,
})

module.exports = model('autoroleConfig', autoroleConfig)