import triggerConfig from "../../../../models/misc/tags/triggerConfig";
import {
  Interpreter,
  RandomParser,
  DefineParser,
  StrictVarsParser,
  IncludesParser,
  RangeParser,
  FiftyFiftyParser,
  IfStatementParser,
  SliceParser,
  BreakParser,
  JSONVarParser,
  StringTransformer,
} from "tagscript";
import {
  MemberTransformer,
  UserTransformer,
  GuildTransformer,
} from "@tagscript/plugin-discord";
import { Events } from "discord.js";

import colors from 'colors'

const cache = new Map();

export default {
  name: Events.MessageCreate,
  run: async (message: import('discord.js').Message) => {
    if (!message.inGuild()) return;
    const cachedInfo = cache.get(message.content.split(' '));
  console.log(cachedInfo)
    if (cachedInfo) {
      console.log(cachedInfo)
      const ts:Interpreter =  new Interpreter(
        new SliceParser(),
        new StrictVarsParser(),
        new FiftyFiftyParser(),
        new RandomParser(),
        new IfStatementParser(),
        new DefineParser(),
        new IncludesParser(),
        new RangeParser(),
        new BreakParser(),
        new JSONVarParser()
      );
  
      
      const rawContent = await ts.run(cachedInfo, {
        member: new MemberTransformer(message.member),
         args: new StringTransformer(message.content),
         guild: new GuildTransformer(message.guild),
         user: new UserTransformer(message.author)
       });

      await message.channel.send(rawContent.toJSON().body).catch(() => {})
      console.log(colors.cyan(`Trigger sent from cache`))
    } else {
      const triggerName =  message.content.split(' ')
      const isTriggerExist = await triggerConfig.findOne(
        { guildId: message.guild.id, triggerName },
      );
      if (!isTriggerExist) return;
  
      const ts:Interpreter = new Interpreter(
        new SliceParser(),
        new StrictVarsParser(),
        new FiftyFiftyParser(),
        new RandomParser(),
        new IfStatementParser(),
        new DefineParser(),
        new IncludesParser(),
        new RangeParser(),
        new BreakParser(),
        new JSONVarParser()
      );
      const rawContent = await ts.run(isTriggerExist.triggerContent, {
        member: new MemberTransformer(message.member),
         args: new StringTransformer(message.content),
         guild: new GuildTransformer(message.guild),
         user: new UserTransformer(message.author)
       });
      await message.channel.send(rawContent.toJSON().body).catch(() => {})
      console.log(colors.blue(`Trigger from MongoDB`))
      cache.set(triggerName, rawContent.toJSON().body)
      console.log(colors.bold(`trigger cached`))

      setTimeout(() => {
          cache.delete(triggerName)
          console.log(colors.red(`cache deleted`))

      }, 15_000)
  }
  }
}