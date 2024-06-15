import { CommandData, SlashCommandProps } from "commandkit";
export const data: CommandData = {
  name: "ping",
  description: "Fetch the bot latency",
  dm_permission: false,
};

export async function run({ interaction, client }: SlashCommandProps) {
  try {
    const wsPing = client.ws.ping;
    await interaction.reply(`> 👋 Pong ${wsPing}ms`);
  } catch (err) {
    console.error(err);
    return;
  }
}
