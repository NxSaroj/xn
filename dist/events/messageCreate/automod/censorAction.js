"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const censorConfig_1 = __importDefault(require("../../../models/moderation/automod/censorConfig"));
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    run: async (message) => {
        if (!message.inGuild())
            return;
        if (!message.member)
            return;
        const isCensorConfigured = await censorConfig_1.default.findOne({
            guildId: message.guild.id,
        });
        if (!isCensorConfigured)
            return;
        const censorWords = isCensorConfigured.censorWords;
        const censorPunishment = isCensorConfigured.censorPunishment;
        let censorLimit = 0;
        try {
            if (censorWords.includes(message.content)) {
                if (message.member.permissions.has("Administrator") ||
                    message.member.permissions.has("ModerateMembers") ||
                    message.member.permissions.has("KickMembers"))
                    return;
                censorLimit += 1;
                let isUserMonitored = await censorConfig_1.default.findOne({
                    userId: message.author.id,
                    guildId: message.guildId,
                });
                if (!isUserMonitored) {
                    isUserMonitored = await censorConfig_1.default.create({
                        userId: message.author.id,
                        censorLimit: censorLimit,
                        guildId: message.guild.id,
                    });
                }
                if (isUserMonitored.censorLimit >= isUserMonitored.censorThreshold) {
                    switch (censorPunishment) {
                        case "Timeout":
                            await message.member.timeout(120000).catch((err) => {
                                return;
                            });
                            await censorConfig_1.default.deleteMany({
                                guildId: message.guildId,
                                userId: message.author.id,
                            });
                            break;
                        case "Ban":
                            await message.member
                                .ban({ reason: "Link threshold reached" })
                                .catch((err) => {
                                return;
                            });
                            await censorConfig_1.default.deleteMany({
                                guildId: message.guildId,
                                userId: message.author.id,
                            }).catch(() => { });
                            break;
                        case "Kick":
                            await message.member
                                .kick(`Link Threshold Reached`)
                                .catch((err) => {
                                return;
                            });
                            await censorConfig_1.default.deleteMany({
                                guildId: message.guildId,
                                userId: message.author.id,
                            }).catch(() => { });
                            break;
                    }
                }
                else {
                    isUserMonitored.censorLimit += 1;
                    await isUserMonitored.save();
                }
                await message
                    .delete()
                    .then(async () => {
                    const response = await message.channel.send(`That word isn't allowed here`);
                    setTimeout(async () => {
                        await response.delete();
                    }, 2000);
                })
                    .catch((err) => {
                    return;
                });
            }
        }
        catch (err) {
            console.error(`Error in ${__filename} \n ${err}`);
            return;
        }
    }
};
