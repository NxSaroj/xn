"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, model } = require('mongoose');
const banUserConfig = new Schema({
    userId: {
        type: [String],
        required: true
    },
});
exports.default = model('banUserConfig', banUserConfig);
