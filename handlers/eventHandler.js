const fs = require('node:fs')
const path = require('node:path')
const searchEvents = (eventPath, client) => {
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

  module.exports = {
    searchEvents
  }
  