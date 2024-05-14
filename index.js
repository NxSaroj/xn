const { Client, GatewayIntentBits } = require("discord.js");
const { CommandKit } = require("commandkit");
const { connect } = require("mongoose");
const path = require("node:path");
const fs = require("node:fs");
const dotenv = require("dotenv");
dotenv.config(); 


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildVoiceStates,
  ], 
})

new CommandKit({
  client: client,
  commandsPath: path.join(__dirname, "commands"),
  devGuildIds: ["1206513471034753064","1201463650624491660"],
  devUserIds: [
    "1129393606432661575",
    "750339984598368287",
    "1078294134051328111",
  ],
  validationsPath: path.join(__dirname, 'validations'),
  bulkRegister: true
});



const searchEvents = (eventPath) => {
<<<<<<< HEAD
  const eventFiles = fs
    .readdirSync(eventPath)
    .filter((file) => file.endsWith(".js"));
=======
    const eventFiles = fs
      .readdirSync(eventPath)
      .filter((file) => file.endsWith(".js"));
  
    eventFiles.forEach((file) => {
      const filePath = path.join(eventPath, file);
      const event = require(filePath);
  
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    });
  
    const subDirectories = fs
      .readdirSync(eventPath)
      .filter((file) => fs.statSync(path.join(eventPath, file)).isDirectory());
  
    subDirectories.forEach((directory) => {
      searchEvents(path.join(eventPath, directory));
    });
  };

searchEvents(path.join(__dirname, 'events'), client)
>>>>>>> 4724ed224dc65c3f0716b36af09f7e0fd7b10c34

  eventFiles.forEach((file) => {
    const filePath = path.join(eventPath, file);
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  });

  const subDirectories = fs
    .readdirSync(eventPath)
    .filter((file) => fs.statSync(path.join(eventPath, file)).isDirectory());

  subDirectories.forEach((directory) => {
    searchEvents(path.join(eventPath, directory));
  });
};

searchEvents(path.join(__dirname, 'events'))


client.rest.on('rateLimited', (data) => {
  console.log(`RateLimited: \n ${JSON.stringify(data)}`)
})

process.on('uncaughtException', (exception) => {
  console.log(exception);
})

process.on('unhandledRejection', (rejection) => {
  console.log(rejection)
})
connect(process.env.DB_URL)
  .then(async () => {
    console.log("DB Connected");
    client.login(process.env.TOKEN).catch((e) => {
      return console.error(`Discord API Error: \n ${e}`);
    });
  })
  .catch(async (e) => {
    return console.error(`Error while connecting to MongoDB: \n ${e}`);
  });
