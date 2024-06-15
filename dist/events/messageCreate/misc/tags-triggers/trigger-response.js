"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const triggerConfig_1 = __importDefault(require("../../../../models/misc/tags/triggerConfig"));
const tagscript_1 = require("tagscript");
const plugin_discord_1 = require("@tagscript/plugin-discord");
const discord_js_1 = require("discord.js");
const colors_1 = __importDefault(require("colors"));
const cache = new Map();
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    run: async (message) => {
        if (!message.inGuild())
            return;
        const cachedInfo = cache.get(message.content.split(' '));
        console.log(cachedInfo);
        if (cachedInfo) {
            console.log(cachedInfo);
            const ts = new tagscript_1.Interpreter(new tagscript_1.SliceParser(), new tagscript_1.StrictVarsParser(), new tagscript_1.FiftyFiftyParser(), new tagscript_1.RandomParser(), new tagscript_1.IfStatementParser(), new tagscript_1.DefineParser(), new tagscript_1.IncludesParser(), new tagscript_1.RangeParser(), new tagscript_1.BreakParser(), new tagscript_1.JSONVarParser());
            const rawContent = await ts.run(cachedInfo, {
                member: new plugin_discord_1.MemberTransformer(message.member),
                args: new tagscript_1.StringTransformer(message.content),
                guild: new plugin_discord_1.GuildTransformer(message.guild),
                user: new plugin_discord_1.UserTransformer(message.author)
            });
            await message.channel.send(rawContent.toJSON().body).catch(() => { });
            console.log(colors_1.default.cyan(`Trigger sent from cache`));
        }
        else {
            const triggerName = message.content.split(' ');
            const isTriggerExist = await triggerConfig_1.default.findOne({ guildId: message.guild.id, triggerName });
            if (!isTriggerExist)
                return;
            const ts = new tagscript_1.Interpreter(new tagscript_1.SliceParser(), new tagscript_1.StrictVarsParser(), new tagscript_1.FiftyFiftyParser(), new tagscript_1.RandomParser(), new tagscript_1.IfStatementParser(), new tagscript_1.DefineParser(), new tagscript_1.IncludesParser(), new tagscript_1.RangeParser(), new tagscript_1.BreakParser(), new tagscript_1.JSONVarParser());
            const rawContent = await ts.run(isTriggerExist.triggerContent, {
                member: new plugin_discord_1.MemberTransformer(message.member),
                args: new tagscript_1.StringTransformer(message.content),
                guild: new plugin_discord_1.GuildTransformer(message.guild),
                user: new plugin_discord_1.UserTransformer(message.author)
            });
            await message.channel.send(rawContent.toJSON().body).catch(() => { });
            console.log(colors_1.default.blue(`Trigger from MongoDB`));
            cache.set(triggerName, rawContent.toJSON().body);
            console.log(colors_1.default.bold(`trigger cached`));
            setTimeout(() => {
                cache.delete(triggerName);
                console.log(colors_1.default.red(`cache deleted`));
            }, 15000);
        }
    }
};
