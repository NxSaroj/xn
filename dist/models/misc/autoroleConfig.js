"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoroleConfig = new mongoose_1.Schema({
    roleId: String,
    guildId: String,
});
exports.default = (0, mongoose_1.model)('autoroleConfig', autoroleConfig);
