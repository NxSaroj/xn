const { Events, Message, Client } = require("discord.js");

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
        await response.edit(`${output}`).catch((err) => {
          return console.error(err);
        });
        return;
      } catch (err) {
        response.edit(`A invalid code was provided`);
        console.error(err);
        return;
      }
    }
  },
};
