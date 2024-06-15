"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cooldowns_cache_1 = require("./cooldowns-cache");
exports.default = ({ interaction, commandObj, handler }) => {
    if (cooldowns_cache_1.cooldowns.has(`${interaction.user.id}-${commandObj.data.name}`)) {
        interaction.reply({
            content: "You're on cooldown, please wait some time before running this command again.",
            ephemeral: true,
        });
        return true; // This is important
    }
};
