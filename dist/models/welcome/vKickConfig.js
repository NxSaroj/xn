"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vKickConfig = new mongoose_1.Schema({
    userId: String,
    guildId: String,
});
exports.default = (0, mongoose_1.model)('vKickConfig', vKickConfig);
