import { Events } from 'discord.js'
import {
  Interpreter,
  RandomParser,
  RangeParser,
  StrictVarsParser,
  FiftyFiftyParser,
  IfStatementParser,
  SliceParser,
  DefineParser,
  IncludesParser,
  BreakParser,
  StringTransformer,
  JSONVarParser,
} from 'tagscript'
import {
  MemberTransformer,
  GuildTransformer,
  UserTransformer
}  from "@tagscript/plugin-discord"
import triggerConfig  from "../../../models/misc/tags/triggerConfig"
const cache = new Map();
export default {
  name: Events.MessageCreate,
  async execute(message: import('discord.js').Message) {
    if (!message.inGuild()) return
    if (!message.member) return;
    if (message.author.bot) return;
    const triggerGuilds = await triggerConfig.findOne({
      guildId: message.guild.id,
    });
    if (!triggerGuilds) return;
    const ts = new Interpreter(
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
    const cachedData = cache.get(message.content);

    if (cachedData) {
      await message.channel.send({
        content: cachedData,
      });
    } else {
      const messageContent = await triggerConfig.findOne({
        triggerName: message.content.trim(),
        guildId: message.guildId,
      });
      if (!messageContent) return;
      if (!messageContent.triggerContent) return;
      /** const contentInput = messageContent.triggerContent
        .replace(`{guild(bots)}`, `${botCount}`)
        .replace(`{guild(humans)}`, `${humanCount}`)
        .replace(`{guild(memberCount)}`, message.guild.memberCount); **/
      const rawContent = await ts.run(messageContent.triggerContent, {
       member: new MemberTransformer(message.member),
        args: new StringTransformer(message.content),
        guild: new GuildTransformer(message.guild),
        user: new UserTransformer(message.author)
      });
      const contentInput = rawContent.toJSON();
      if (!contentInput) return;

      try {
        await message.channel.send({
          content: contentInput.body || "Error Occured. Try again later"
        });
        cache.set(message.content, contentInput?.body);
        setTimeout(() => {
          cache.delete(message.content);
        }, 30_000);
        return;
      } catch (e) {
        console.error(e);
        return await message.channel.send({
          content: "Trigger Syntax Error, Make Sure Your Tagscript Is Correct!",
        });
      }
    }
  },
};
