"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const aiConfig = new mongoose_1.Schema({
    guildId: String,
    aiModel: {
        type: String,
        default: 'chat-gpt'
    },
    channel: String,
});
exports.default = (0, mongoose_1.model)('aiConfig', aiConfig);
