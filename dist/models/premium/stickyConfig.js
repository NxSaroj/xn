"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const stickyConfig = new mongoose_1.Schema({
    userId: String,
    guildId: String,
    roles: {
        type: [String],
        default: []
    }
});
exports.default = (0, mongoose_1.model)('stickyConfig', stickyConfig);
