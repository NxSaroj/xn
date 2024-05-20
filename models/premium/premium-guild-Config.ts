const { Schema, model } = require('mongoose')

const premiumGuildConfig = new Schema({
    guildId: [String],
    guildName: [String]
})

module.exports = model('premiumGuildConfig', premiumGuildConfig)