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
  StringTransformer,
} from "tagscript";
import {
  MemberTransformer,
  UserTransformer,
  GuildTransformer,
} from "@tagscript/plugin-discord";
import { Events } from "discord.js";

const cache = new Map();

export default {
  name: Events.MessageCreate,
  run: async (message: import('discord.js').Message) => {
    console.log(message.content)
    if (!message.inGuild()) return;
    const cachedInfo = cache.get(message.content);
  
    if (cachedInfo) {
      const ts:Interpreter =  new Interpreter(
        new RandomParser(),
        new DefineParser(),
        new StrictVarsParser(),
        new IfStatementParser(),
        new RangeParser(),
        new FiftyFiftyParser(),
        new SliceParser(),
        new IncludesParser()
      );
  
      const result = await ts.run(cachedInfo || "", {
        member: new MemberTransformer(message?.member),
        user: new UserTransformer(message.author),
        guild: new GuildTransformer(message.guild),
        args: new StringTransformer(message.content),
      });
      await message.channel.send(result?.body?.toString()).catch(() => {});
    } else {
      const triggerName =  message.content
      const isTriggerExist = await triggerConfig.findOne(
        { guildId: message.guild.id },
        { triggerName }
      );
      if (!isTriggerExist) return;
  
      const ts = new Interpreter(
        new RandomParser(),
        new DefineParser(),
        new StrictVarsParser(),
        new IfStatementParser(),
        new RangeParser(),
        new FiftyFiftyParser(),
        new SliceParser(),
        new IncludesParser()
      );
  
      const result = await ts.run(isTriggerExist?.triggerContent || "", {
        member: new MemberTransformer(message?.member),
        user: new UserTransformer(message.author),
        guild: new GuildTransformer(message.guild),
        args: new StringTransformer(message.content),
      });
      await message.channel.send(result?.body).catch((e) => { console.error(e) });
      cache.set(triggerName, result?.body?.toString())
      setTimeout(() => {
          cache.delete(triggerName)
      }, 15_000)
  }
  }
}