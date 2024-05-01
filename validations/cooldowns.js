const cooldowns = new Map()
module.exports = ({ interaction, commandObj, handler }) => {
    if (cooldowns.has(interaction.user.id - commandObj.data.name)) {
        interaction.reply({
            content: "You are on a cooldown, wait for a while",
            ephemeral: true
        })
        return true;
    }
}