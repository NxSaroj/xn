import { Events, type Message } from 'discord.js'
import type { Client } from 'discord.js';
import triggerConfig from "../../../models/misc/tags/triggerConfig";
import premiumGuildConfig from "../../../models/premium/premium-guild-Config";


export default {
  name: 'messageCreate',
  run: (message:any) => {
    console.log(message)
  }
}

