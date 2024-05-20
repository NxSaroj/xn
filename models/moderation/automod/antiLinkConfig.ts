import { Schema, model } from 'mongoose'

const antiLinkConfig = new Schema({
    guildId: String,
    whiteListLink: [String],
    dmMessage: {
        type: String,
        default: `{target(user.username)} You cant send links in {guild.name}`
    },
    replyMessage: {
        type: String,
        default: `{target(user.username)} Links are not allowed in {guild.name}`
    },
    linkThreshold: {
        type: Number,
        default: 3
    },
    userId: {
        type: String, 
    },
    linkCount: {
        type: Number,
        default: 0
    },
    ignoreRoleId: {
     type: String,
    },
    punishMent: {
        type: String,
        default: 'Timeout'
    },
    timeStamps: {
        type: Date,
        default: new Date()
    }
})



export default model('antiLinkConfig', antiLinkConfig)