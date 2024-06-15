"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const link_channel_config_1 = __importDefault(require("../../../models/misc/link-channel-config"));
exports.data = {
    name: 'disable-link-only',
    description: 'Disable the link only channel',
    dm_permission: false
};
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.reply({
            content: "**Required permissions** <:xn_arrow:1206238725130952755> `Manage Channel(s)`",
            ephemeral: true,
        });
    }
    const isLinkOnlyEnabled = await link_channel_config_1.default.findOne({
        guildId: interaction.guild.id
    }).catch((err) => { return console.error(err); });
    if (!isLinkOnlyEnabled) {
        return await interaction.reply({
            content: "Nothing changed, As there is no link only channel",
            ephemeral: true
        });
    }
    try {
        await link_channel_config_1.default.deleteMany({
            guildId: interaction.guild.id
        }).then(async () => {
            const embed = new discord_js_1.EmbedBuilder()
                .setDescription(`> **Link Only Channel Disabled** <:xn_arrow:1206238725130952755> <#${isLinkOnlyEnabled.channelId}>`)
                .setColor('White');
            await interaction.reply({
                embeds: [embed]
            });
        }).catch(async (err) => {
            console.error(err);
            return await interaction.reply({
                content: "DB Error, Try Again Later",
                ephemeral: true
            });
        });
    }
    catch (err) {
        return console.error(`Error in ${__filename} \n ${err}`);
    }
}
exports.run = run;
