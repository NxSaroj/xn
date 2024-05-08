const { Schema, model } = require('mongoose')

const ignoreConfig = new Schema({
    linkIgnoreRoleId: String,
    censorIgnoreRoleId: String,
    guildId: String
})

module.exports = model('ignoreConfig', ignoreConfig)