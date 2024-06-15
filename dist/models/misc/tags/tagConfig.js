"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tagConfig = new mongoose_1.Schema({
    tagName: {
        type: String,
        required: true
    },
    tagContent: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
});
exports.default = (0, mongoose_1.model)('tagConfig', tagConfig);
