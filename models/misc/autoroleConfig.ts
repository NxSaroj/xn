import { Schema, model }  from 'mongoose'

const autoroleConfig = new Schema({
    roleId: String,
    guildId: String,
})

export default model('autoroleConfig', autoroleConfig)