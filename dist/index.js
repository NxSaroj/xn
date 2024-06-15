"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commandkit_1 = require("commandkit");
const eventHandler_1 = require("./utilities/handlers/eventHandler");
const mongoose_1 = require("mongoose");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildMessages,
    ],
});
new commandkit_1.CommandKit({
    client: client,
    commandsPath: path_1.default.join(__dirname, "commands"),
    devGuildIds: ["1240657449569226863"],
    devUserIds: [
        "1129393606432661575",
        "750339984598368287",
        "1078294134051328111",
    ],
    validationsPath: path_1.default.join(__dirname, "validations"),
    bulkRegister: true,
});
(0, eventHandler_1.loadEvents)(path_1.default.join(__dirname, 'events'), client);
client.rest.on("rateLimited", console.log);
client.on('ready', () => {
    client?.user?.setActivity(`Shard ${client.shard?.ids[0]}`);
});
process.on("uncaughtException", (exception) => {
    console.log(exception);
});
process.on("unhandledRejection", (rejection) => {
    console.log(rejection);
});
(async () => {
    await (0, mongoose_1.connect)(process.env.DB_URL || "")
        .catch(async (e) => {
        return console.error(`Error while connecting to MongoDB: \n ${e}`);
    });
    client.login(process.env?.TOKEN);
})();
