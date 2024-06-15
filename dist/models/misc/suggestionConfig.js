"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { randomUUID } = require('crypto');
const suggestionConfig = new mongoose_1.Schema({
    suggestionId: {
        type: String,
        default: randomUUID
    },
    authorId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pendig'
    },
});
exports.default = (0, mongoose_1.model)('suggestionConfig', suggestionConfig);
