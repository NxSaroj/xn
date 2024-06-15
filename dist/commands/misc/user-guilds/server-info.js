"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = {
    name: 'server-info',
    description: 'Get information about the current guild',
    dm_permission: false
};
async function run({ interaction }) {
    if (!interaction.inCachedGuild())
        return;
    const response = await interaction.reply({
        content: "Fetching the information about the guild"
    });
    interaction.guild.ownerId.replace(interaction.guild.ownerId, 'syst');
    try {
        const serverInfoEmbed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL() || interaction.user.displayAvatarURL()
        })
            .setThumbnail(interaction.guild.iconURL())
            .setColor('White')
            .setTitle(`**Server Information** <:xn_arrow:1207610123778920448> **${interaction.guild.name}** `)
            .addFields({ name: 'Owner', value: (await interaction.guild.fetchOwner()).user.username, inline: true }, { name: 'Member Count', value: `${interaction.guild.memberCount}`, inline: true }, { name: 'Created At', value: interaction.guild.createdAt.toDateString(), inline: true }, { name: 'Role List', value: interaction.guild.roles.cache.toJSON().join(','), inline: false })
            .setFooter({
            text: `Requested By ${interaction.user.username}`
        });
        await response.edit({
            content: "",
            embeds: [serverInfoEmbed]
        });
    }
    catch (err) {
        await response.edit({
            content: "Error occured, Try again later"
        });
        console.error(err);
        return console.error(`Error in ${__filename} \n ${err}`);
    }
}
exports.run = run;
