"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ignoreConfig = new mongoose_1.Schema({
    linkIgnoreRoleId: String,
    censorIgnoreRoleId: String,
    guildId: String
});
exports.default = (0, mongoose_1.model)('ignoreConfig', ignoreConfig);
