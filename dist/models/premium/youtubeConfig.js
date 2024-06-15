"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const youtubeConfig = new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: [String],
        required: String,
    },
    customMessage: {
        type: String,
        required: true
    },
    messageChannel: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true
    },
    lastUpdatedVideo: {
        type: {
            id: {
                type: String,
                required: true
            },
            pubDate: {
                type: Date,
                required: true
            }
        },
        required: false,
    }
});
exports.default = (0, mongoose_1.model)('youtubeConfig', youtubeConfig);
