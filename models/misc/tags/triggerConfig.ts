import { Schema, model } from 'mongoose'

const triggerConfig = new Schema({
    triggerName: [String],
    triggerContent: String,
    guildId: String,
})

export default model('triggerConfig', triggerConfig)