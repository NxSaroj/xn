"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
exports.data = {
    name: "temp-role",
    description: "Give user access to a role temproary",
    options: [
        {
            name: "role",
            description: "The role you want to add",
            type: discord_js_1.ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: "user",
            description: "The user you want to add the role",
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "duration",
            description: "The duration untill the role remains added",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    dm_permission: false,
};
async function run({ interaction, }) {
    if (!interaction.inCachedGuild())
        return;
    if (!interaction.guild.members?.me?.permissions.has("ManageRoles")) {
        return await interaction.reply({
            content: `> I need manage roles permissions to execute this command`,
        });
    }
    const targetRole = interaction.options.getRole("role");
    if (!targetRole)
        return;
    const duration = interaction.options.getString("duration");
    const member = interaction.options.getMember("user");
    const vaildDuration = (0, ms_1.default)(duration);
    if (!member) {
        return await interaction.reply({
            content: "Please provide a valid member",
            ephemeral: true,
        });
    }
    if (isNaN(vaildDuration)) {
        return await interaction.reply({
            content: "Please provide a valid duration",
            ephemeral: true,
        });
    }
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;
    const rolePosition = targetRole.position;
    if (!targetRole)
        return;
    if (rolePosition >= botRolePosition) {
        return await interaction.reply({
            content: "I cant assing that role",
            ephemeral: true,
        });
    }
    else if (rolePosition >= requestUserRolePosition) {
        return await interaction.reply({
            content: "You cant assing that role",
            ephemeral: true,
        });
    }
    try {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("White")
            .setDescription(`> <:xn_tick:1209742516832706642> Added ${targetRole} to ${member} for ${vaildDuration}`);
        await member.roles.add(targetRole).catch((err) => {
            return;
        });
        await interaction.reply({
            embeds: [embed],
        });
        setTimeout(async () => {
            await member.roles.remove(targetRole).catch((err) => {
                return;
            });
        }, vaildDuration);
    }
    catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        return;
    }
}
exports.run = run;
