"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spotlightConfig = new mongoose_1.Schema({
    userId: {
        type: String,
    },
    spotlightWord: {
        type: [String]
    },
    guildId: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)('spotlightConfig', spotlightConfig);
