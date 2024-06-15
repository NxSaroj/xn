"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const welcomeConfig = new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String
    },
    welcomeEmbed: {
        type: Object
    }
});
exports.default = (0, mongoose_1.model)('welcomeConfig', welcomeConfig);
