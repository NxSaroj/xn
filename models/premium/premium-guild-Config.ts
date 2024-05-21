import { Schema, model } from 'mongoose'

const premiumGuildConfig = new Schema({
    guildId: [String],
    guildName: [String]
})

export default model('premiumGuildConfig', premiumGuildConfig)