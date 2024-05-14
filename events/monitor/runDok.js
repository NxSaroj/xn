const { Events, Message, Client } = require("discord.js");
const triggerConfig = require("../../models/misc/tags/triggerConfig");
const premiumGuildConfig = require("../../models/premium/premium-guild-Config");
module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  async execute(message, client) {
    const ownerId = ["1129393606432661575"];
    if (!ownerId.includes(message.author.id)) return;
    if (message.content.startsWith(".run")) {
      const startTime = new Date().getTime();
      const code = message.content.slice(".run".length).trim();
      if (!code) return;
      const response = await message.channel.send(
        "Running The Code, Wait a bit..."
      );
      try {
        const { default: prettyMilliseconds } = await import("pretty-ms");

        let output = await eval(code);
        if (typeof output === "object") {
          output = `\`\`\`js\n${JSON.stringify(output, null, 2)}\n\`\`\``;
        }
        const endTime = new Date().getTime();
        await response
          .edit(
            `**__Result:__** \n\n ${output} \n\n **Time Taken**\n ${prettyMilliseconds(
              endTime - startTime
            )}\n\n**__Type:__**\n${typeof output}`
          )
          .catch((err) => {
            return response.edit(`**__Error__** \n ${err}`);
          });
        return;
      } catch (err) {
        response.edit(`**__Error__** \n ${err}`);
        console.error(err);
        return;
      }
    }
  },
};
