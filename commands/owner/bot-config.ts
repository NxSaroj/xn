import type {
    CommandData,
    SlashCommandProps,
  } from "commandkit";
  import { type APIEmbed } from "discord.js";
  import prettyMilliseconds from "pretty-ms";
  import { emojis } from "../../utilities/json/config.json";
  
  import os from "node:os";
  
  export const data: CommandData = {
    name: "bot-config",
    description: "Bots configration",
    dm_permission: false,
  };
  
  export async function run({ interaction, client }: SlashCommandProps) {
      const totalMemoryUsage = os.totalmem() - os.freemem()
      const totalMemoryUsagePercent = (totalMemoryUsage / os.totalmem())*100
    const embed: APIEmbed = {
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
  > **Uptime**: ${prettyMilliseconds(client.uptime)}
  
  **Bot Usage**
  > **Total Users:** ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}
  > **Total Guilds:**: ${client.guilds.cache.size}
  > **Cached Users**: ${client.users.cache.size}
  `,
    };

    await interaction.reply({
      embeds: [embed]
    }).catch(err => console.log(err))
  }
  
  
  