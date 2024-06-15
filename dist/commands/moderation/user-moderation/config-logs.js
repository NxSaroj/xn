"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../../utilities/json/config.json");
const logConfigMenu_1 = require("../../../utilities/select-menu/logConfigMenu");
const logsConfig_1 = __importDefault(require("../../../models/moderation/logs/logsConfig"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("logs-config")
    .setDescription("Check the log configration of the guild")
    .setDMPermission(false);
async function run({ interaction, }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({
            content: "> **Required Permissions** <:xn_arrow:1206238725130952755> `Administrator`",
            ephemeral: true,
        });
    }
    const guildConfig = await logsConfig_1.default.findOne({
        guildId: interaction.guild.id,
    });
    try {
        const embed = {
            color: 0xffffff,
            author: {
                name: `${interaction.guild.name}`,
                icon_url: interaction.guild.iconURL() || undefined,
            },
            fields: [
                {
                    name: `Message Logs`,
                    value: `${guildConfig?.messageLog ? config_json_1.emojis.xn_tick : config_json_1.emojis.xn_wrong}`,
                    inline: false,
                },
                {
                    name: `Channel Logs`,
                    value: `${guildConfig?.channelLog ? config_json_1.emojis.xn_tick : config_json_1.emojis.xn_wrong}`,
                    inline: false,
                },
                {
                    name: `Join Leave Logs`,
                    value: `${guildConfig?.welcomeLog ? config_json_1.emojis.xn_tick : config_json_1.emojis.xn_wrong}`,
                    inline: false,
                },
            ],
        };
        const response = await interaction.reply({
            embeds: [embed],
            components: [logConfigMenu_1.logsConfigRow],
        });
        const collector = response.createMessageComponentCollector({
            filter: (i) => i.user.id == interaction.user.id,
            time: 240000,
            componentType: discord_js_1.ComponentType.StringSelect,
        });
        collector.on("collect", async (i) => {
            switch (i.values[0]) {
                case "enable-logs":
                    await i.deferReply({ ephemeral: true });
                    const isLogsEnabled = await logsConfig_1.default.exists({
                        guildId: interaction.guild.id,
                    });
                    if (isLogsEnabled) {
                        return logsConfig_1.default
                            .deleteMany({ guildId: interaction.guildId })
                            .then(() => {
                            i.editReply({ content: "Disabled The Module" });
                        })
                            .catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    const channel = await interaction.guild.channels
                        .create({
                        name: "xantrack-logs",
                        type: discord_js_1.ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guildId,
                                deny: ["ViewChannel"],
                            },
                        ],
                    })
                        .catch(() => {
                        return i.reply({
                            content: "I dont have permission to create a channel",
                            ephemeral: true,
                        });
                    });
                    logsConfig_1.default
                        .create({
                        channelId: channel.id,
                        guildId: interaction.guildId,
                        messageLog: true,
                        channelLog: true,
                        modLog: true,
                        welcomeLog: true,
                    })
                        .then(() => {
                        i.editReply({
                            content: `Logs has been enabled and can be accessed in ${channel}`,
                        });
                    })
                        .catch((err) => {
                        console.error(err);
                        i.editReply({ content: "DB Error, Try again later" });
                        return;
                    });
                    break;
                case "message-logs":
                    await i.deferReply({ ephemeral: true });
                    const isMLogEnabled = await logsConfig_1.default.findOne({
                        guildId: interaction.guild.id,
                    });
                    if (!isMLogEnabled)
                        return await i.editReply({
                            content: "The log module is not enabled",
                        });
                    if (isMLogEnabled.messageLog == true) {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { messageLog: false })
                            .then(() => {
                            i.editReply({
                                content: "Message will not be logged from now on",
                            });
                            embed.fields[0].value = config_json_1.emojis.wrong;
                            response.edit({ embeds: [embed] });
                        })
                            .catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    else {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { messageLog: true })
                            .then(() => {
                            i.editReply({ content: "Message will  be logged from now on" });
                        });
                        embed.fields[0].value = config_json_1.emojis.xn_tick;
                        response.edit({ embeds: [embed] }).catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    break;
                case "channel-logs":
                    await i.deferReply({ ephemeral: true });
                    const isCLogEnabled = await logsConfig_1.default.findOne({
                        guildId: interaction.guild.id,
                    });
                    if (!isCLogEnabled)
                        return await i.editReply({
                            content: "The log module is not enabled",
                        });
                    if (isCLogEnabled.channelLog == true) {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { channelLog: false })
                            .then(() => {
                            i.editReply({
                                content: "Channel Updates will not be logged from now on",
                            });
                            embed.fields[1].value = config_json_1.emojis.xn_wrong;
                            response.edit({ embeds: [embed] });
                        })
                            .catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    else {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { channelLog: true })
                            .then(() => {
                            i.editReply({
                                content: "Channel Updates will  be logged from now on",
                            });
                        });
                        embed.fields[1].value = config_json_1.emojis.xn_tick;
                        response.edit({ embeds: [embed] }).catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    break;
                case "welcome-logs":
                    await i.deferReply({ ephemeral: true });
                    const isWLogEnabled = await logsConfig_1.default.findOne({
                        guildId: interaction.guild.id,
                    });
                    if (!isWLogEnabled)
                        return await i.editReply({
                            content: "The log module is not enabled",
                        });
                    if (isWLogEnabled.messageLog == true) {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { welcomeLog: false })
                            .then(() => {
                            i.editReply({
                                content: "Welcome not be logged from now on",
                            });
                            embed.fields[2].value = config_json_1.emojis.xn_wrong;
                            response.edit({ embeds: [embed] });
                        })
                            .catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    else {
                        logsConfig_1.default
                            .findOneAndUpdate({ guildId: interaction.guildId }, { welcomeLog: true })
                            .then(() => {
                            i.editReply({ content: "Welcome will  be logged from now on" });
                            embed.fields[2].value = config_json_1.emojis.xn_tick;
                            response.edit({ embeds: [embed] });
                        })
                            .catch((err) => {
                            console.error(err);
                            i.editReply({ content: "DB Error, Try again later" });
                            return;
                        });
                    }
                    break;
            }
        });
    }
    catch (err) {
        console.log(`Error in ${__filename} \n ${err}`);
        return await interaction.reply({
            content: "Logs has not been configured for this server \n Run `/add-log-channel` to add a log channel",
            ephemeral: true,
        });
    }
}
exports.run = run;
