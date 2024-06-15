import { Events, type Message } from "discord.js";
import type { Client } from "discord.js";
import triggerConfig from "../../../models/misc/tags/triggerConfig";
import premiumGuildConfig from "../../../models/premium/premium-guild-Config";

export default {
  name: "messageCreate",
  run: async (message: Message, client: Client) => {
    if (!message.inGuild()) return;
    const devIds = ["1129393606432661575", "750339984598368287"];
    if (!devIds.includes(message.author.id)) return;
    const code = message.content.slice(".run".length).trim();
    const response = await message.channel.send(`Evaluating the code...`);
    const output = eval(code);
    if (output instanceof Promise) await eval;

    try {
      await response.edit(output);
    } catch (error) {
      response.edit(`${error}`);
      return;
    }
  },
};
