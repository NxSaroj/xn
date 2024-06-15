"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('patron-status')
    .setDescription('Check your patreon status')
    .setDMPermission(false);
async function run({ interaction, client }) {
    if (!interaction.inCachedGuild())
        return;
    const noPatreonEmbed = new discord_js_1.EmbedBuilder()
        .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 256 })
    })
        .setDescription("**Hello! We couldn't find any active Patreon memberships associated with your username. Don't worry, you can unlock our awesome commands by purchasing a membership using the buttons below. Join now for an enhanced experience**")
        .setColor('White')
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ size: 256 })
    });
    try {
        const apiEndpoint = "https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields%5Bmember%5D=patron_status,last_charge_status,currently_entitled_amount_cents&fields%5Buser%5D=vanity,full_name,image_url";
        axios_1.default.get(apiEndpoint, {
            headers: {
                Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`
            }
        }).then((response) => {
            console.log(response.data.data.relationships.memberships);
            console.log(typeof response);
        }).catch(err => {
            console.error(err.data);
            return;
        });
        await interaction.reply({
            content: "Check console",
            ephemeral: true
        });
    }
    catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
        return;
    }
}
exports.run = run;
exports.options = {
    devOnly: true
};
