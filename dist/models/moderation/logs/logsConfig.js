"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logsConfig = new mongoose_1.Schema({
    channelId: String,
    guildId: String,
    messageLog: {
        type: Boolean,
        default: true,
    },
    channelLog: {
        type: Boolean,
        default: true,
    },
    welcomeLog: {
        type: Boolean,
        default: true,
    },
    modLog: {
        type: Boolean,
        default: true,
    },
});
exports.default = (0, mongoose_1.model)("logsConfig", logsConfig);
