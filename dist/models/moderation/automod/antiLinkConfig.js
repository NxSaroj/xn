"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const antiLinkConfig = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('antiLinkConfig', antiLinkConfig);
