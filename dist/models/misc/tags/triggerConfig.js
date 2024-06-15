"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const triggerConfig = new mongoose_1.Schema({
    triggerName: String,
    triggerContent: String,
    guildId: String,
});
exports.default = (0, mongoose_1.model)('triggerConfig', triggerConfig);
