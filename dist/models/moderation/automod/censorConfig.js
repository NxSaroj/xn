"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const censorConfig = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('censorConfig', censorConfig);
