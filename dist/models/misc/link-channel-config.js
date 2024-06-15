"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const linkOnlyConfig = new mongoose_1.Schema({
    channelId: String,
    guildId: String
});
exports.default = (0, mongoose_1.model)('linkOnlyConfig', linkOnlyConfig);
