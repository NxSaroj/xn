"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const premiumGuildConfig = new mongoose_1.Schema({
    guildId: [String],
    guildName: [String]
});
exports.default = (0, mongoose_1.model)('premiumGuildConfig', premiumGuildConfig);
