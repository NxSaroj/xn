"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
exports.data = {
    name: "ping",
    description: "Fetch the bot latency",
    dm_permission: false,
};
async function run({ interaction, client }) {
    try {
        const wsPing = client.ws.ping;
        await interaction.reply(`> 👋 Pong ${wsPing}ms`);
    }
    catch (err) {
        console.error(err);
        return;
    }
}
exports.run = run;
