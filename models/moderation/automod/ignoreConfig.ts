import { Schema, model } from 'mongoose'

const ignoreConfig = new Schema({
    linkIgnoreRoleId: String,
    censorIgnoreRoleId: String,
    guildId: String
})

export default model('ignoreConfig', ignoreConfig)