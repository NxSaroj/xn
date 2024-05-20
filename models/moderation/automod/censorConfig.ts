import { Schema, model } from 'mongoose'

const censorConfig = new Schema({
    guildId: String,
    censorWords: [String],
    replyMessage: {
        type: String,
        default: `Hey **{target(user.username)}** That word is not allowed here`
    },
    dmMessage: {
        type: String,
        default: `Please dont type censor words in **{guild.name}**`
    },
    censorPunishment: {
        type: String,
        default: 'Timeout'
    },
    censorThreshold: {
        type: Number,
        default: 3,
    },
    userId: {
        type: String,
    },
    censorLimit: {
        type: Number,
        default: 0
    },
    censorUser: String,
})

export default model('censorConfig', censorConfig)