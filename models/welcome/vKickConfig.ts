import { Schema, model } from 'mongoose'

const vKickConfig = new Schema({
    userId: String,
    guildId: String,
})

export default model('vKickConfig', vKickConfig)