"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.data = void 0;
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const node_os_1 = __importDefault(require("node:os"));
exports.data = {
    name: "bot-config",
    description: "Bots configration",
    dm_permission: false,
};
async function run({ interaction, client }) {
    const totalMemoryUsage = node_os_1.default.totalmem() - node_os_1.default.freemem();
    const totalMemoryUsagePercent = (totalMemoryUsage / node_os_1.default.totalmem()) * 100;
    const embed = {
        author: {
            name: interaction.user.username,
            icon_url: client.user.displayAvatarURL({ size: 256 }),
        },
        color: 0xFFFFFF,
        description: `**Memory Usage**   
  > **Ram:** ${totalMemoryUsagePercent.toFixed(2)}%               
  
  **API Usage**
  > **Shard Count:** ${client.shard?.count}
  > **Guild Shard:** ${client.shard?.ids}
  > **Uptime**: ${(0, pretty_ms_1.default)(client.uptime)}
  
  **Bot Usage**
  > **Total Users:** ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}
  > **Total Guilds:**: ${client.guilds.cache.size}
  > **Cached Users**: ${client.users.cache.size}
  `,
    };
    await interaction.reply({
        embeds: [embed]
    }).catch(err => console.log(err));
}
exports.run = run;
