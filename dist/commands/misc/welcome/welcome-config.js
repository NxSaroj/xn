"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const config_json_1 = require("../../../utilities/json/config.json");
exports.data = {
    name: 'welcome-config',
    description: 'Manage the welcome module',
    dm_permission: false,
};
async function run({ interaction, client }) {
    const embed = {
        author: {
            name: 'welcome-module',
            icon_url: client.user.displayAvatarURL({ size: 256 })
        },
        footer: {
            text: `Requested by ${interaction.user.username}`,
            icon_url: interaction.user.displayAvatarURL()
        },
        description: `**Welcome Module**\n\n > Enabled ${config_json_1.emojis.xn_arrow} `
    };
}
exports.run = run;
