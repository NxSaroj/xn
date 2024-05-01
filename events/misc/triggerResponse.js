const { Events, EmbedBuilder } = require('discord.js')
const triggerConfig = require('../../models/misc/tags/triggerConfig')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        const triggerGuilds = await triggerConfig.findOne({
            guildId: message.guild.id,
        })
        if (!triggerGuilds) return;

        const messageContent = await triggerConfig.findOne({
            triggerName: message.content,
            guildId: message.guild.id
        })

        if (!messageContent) return;


        const botCount = message.guild.members.cache.filter(member => member.user.bot).size;
        const humanCount = message.guild.members.cache.filter(member => !member.user.bot).size;
        const embed = new EmbedBuilder()
        const contentInput = messageContent.triggerContent
        .replace(`{guild(bots)}`,  `${botCount}`)
        .replace(`{guild(humans)}`, `${humanCount}`)
        .replace(`{guild(memberCount)}`, message.guild.memberCount)
        if (!contentInput) return;
        
        const embedMatches = [...contentInput.matchAll(/\{embed\((\w+)\): (.+?)\}/g)];
        
               
        
        

        if (!embedMatches.length) {
          return await message.channel.send({
            content: contentInput
          })
        }

        try {
            for (const [, property, value] of embedMatches) {
              switch (property.toLowerCase()) {
                case 'title':
                  embed.setTitle(value);
                  break;
                case 'description':
                  embed.setDescription(value);
                  break;
                case 'color':
                  embed.setColor(value);
                  break;
                case 'thumbnail':
                  embed.setThumbnail(value);
                  break;
                case 'image':
                  embed.setImage(value);
                  break;
                default:
                  break;
              }
            }

          
         
          } catch (e) {
            console.error(e);
            return await message.channel.send({
              content: 'Invalid values are provieded in triggers, re-check your trigger to fix',
            });
          }

   
          
          const contents = contentInput
          .replace(/\{embed\((\w+)\): (.+?)\}/g, '')
         .replace(`{guild(bots)}`,  `${botCount}`)
         .replace(`{guild(humans)}`, `${humanCount}`)

          

          if (!embedMatches) return;
          
          try {
            await message.channel.send({
              content: contents,
              embeds: [embed],
            });
            return;
          } catch (e) {
            
            console.error(e);
            return await message.channel.send({
                content: 'Error while sending the trigger content, try-again later'
            })
          }

    }
}