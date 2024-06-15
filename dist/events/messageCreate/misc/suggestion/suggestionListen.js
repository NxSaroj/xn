"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guildConfig_1 = __importDefault(require("../../../../models/misc/guildConfig"));
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    run: async (message) => {
        if (!message.inGuild())
            return;
        const isSuggestionEnabled = await guildConfig_1.default.findOne({
            guildId: message.guild.id
        }).catch((e) => {
            return console.error(e);
        });
        if (!isSuggestionEnabled)
            return;
        const suggestionChannel = isSuggestionEnabled.channelId;
        try {
            if (message.channelId === suggestionChannel) {
                if (message.author.bot)
                    return;
                setTimeout(async () => {
                    await message.delete().catch(() => {
                        return;
                    });
                }, 2000);
            }
        }
        catch (err) {
            console.error(`Error in ${__filename} \n ${err}`);
            return;
        }
    }
};
