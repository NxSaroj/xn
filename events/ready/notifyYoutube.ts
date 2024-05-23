const { Events } = require("discord.js");

const Parser = require("rss-parser");
const parser = new Parser();
const youtubeConfig = require("../../models/premium/youtubeConfig");

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    checkYoutube().catch((err) => {
      return console.error(err);
    });
    setInterval(checkYoutube, 35_000);

    async function checkYoutube () {
      try {
        const channels = await youtubeConfig.find();
        for (const channel of channels) {
          const rss_url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`;
          const feed = await parser.parseURL(rss_url).catch((e) => {
            return console.error(e);
          });
          if (!feed?.items.length) continue;

          const latestVideo = feed.items[0];
          const lastUpdatedVideo = channel.lastUpdatedVideo;

          if (
            !lastUpdatedVideo ||
            (latestVideo.id.split(":")[2] !== lastUpdatedVideo.id &&
              new Date(latestVideo.pubDate) >
                new Date(lastUpdatedVideo.pubDate))
          ) {
            const targetGuild =
              client.guilds.cache.get(channel.guildId) ||
              (await client.guilds.fetch(channel.guildId));
            if (!targetGuild) {
              await youtubeConfig
                .deleteMany({
                  guildId: channel.guildId,
                })
                .catch((err) => {
                  return console.error(err);
                });
              continue;
            }

            const targetChannel =
              targetGuild.channels.cache.get(channel.messageChannel) ||
              (await targetGuild.channels.fetch(channel.messageChannel));

            if (!targetChannel) {
              await youtubeConfig
                .deleteMany({
                  guildId: channel.guildId,
                })
                .catch((err) => {
                  return console.error(err);
                });
              continue;
            }

            channel.lastUpdatedVideo = {
              id: latestVideo.id.split(":")[2],
              pubDate: latestVideo.pubDate,
            };

            await channel.save().then(async () => {
              const customMessage = channel.customMessage
                .replace(`{channel}`, feed.title)
                .replace(`{link}`, latestVideo.link)
                .replace(`{title}`, latestVideo.title)
                .replace(`{channel.url}`, feed.link);

              await targetChannel.send(customMessage).catch((err) => {
                return console.error(err);
              });
            });
          }
        }
      } catch (err) {
        console.error(`Error in ${__filename} \n ${err}`);
        return;
      }
    };
  },
};
