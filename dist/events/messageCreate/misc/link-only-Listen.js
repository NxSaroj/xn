"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const link_channel_config_1 = __importDefault(require("../../../models/misc/link-channel-config"));
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    run: async (message) => {
        try {
            const isLinkOnlyEnabled = await link_channel_config_1.default.findOne({
                guildId: message.guild.id
            }).catch((err) => { return console.error(err); });
            if (!isLinkOnlyEnabled)
                return;
            const linkOnlyChannel = isLinkOnlyEnabled.channelId;
            if (!linkOnlyChannel) {
                await link_channel_config_1.default.deleteMany({
                    guildId: message.guild.id
                }).catch(err => { return console.error(err); });
                return;
            }
            if (message.channelId == linkOnlyChannel) {
                if (message.content.startsWith('https://') || message.content.startsWith('http://'))
                    return;
                setTimeout(async () => {
                    await message.delete().catch(() => { return; });
                    await message.channel.send(`<@${message.author.id}> Only links are allowed here`);
                }, 1000);
            }
        }
        catch (err) {
            console.error(`Error in ${__filename} \n ${err}`);
            return;
        }
    }
};
