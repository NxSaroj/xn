import { Events } from 'discord.js'
import type { Client } from 'discord.js';
import triggerConfig from "../../models/misc/tags/triggerConfig";
import premiumGuildConfig from "../../models/premium/premium-guild-Config";
export default {
  name: Events.MessageCreate,
  async execute(message:any, client:Client) {
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
          .catch((err:any) => {
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
