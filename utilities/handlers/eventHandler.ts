import type { Client } from 'discord.js'
import colors from 'colors'
import fs from 'node:fs'
import path from 'node:path'

const loadEvents = (dir:string, client:Client) => {
    const eventFiles = fs.readdirSync(dir)
    eventFiles.forEach(file => {
        const filesPath = path.join(dir, file)
        const stats = fs.statSync(filesPath)
        if (stats.isDirectory()) {
            loadEvents(filesPath, client)
        } else {
           try {
            const event = require(filesPath).default;
            if (!event) console.warn(colors.red(`No default exporting in ${filesPath}`))
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client))
                console.log(colors.green(`Loaded ${event.name} event`))
            } else {
                client.on(event.name, (...args) => event.run(...args, client))
                console.log(colors.green(`Loaded ${event.name} event of dir ${filesPath}`))
            }
           } catch (error) {
                console.error(colors.red(`Error loading event: ${filesPath} : Error \n ${error}`))
                return
           }
        }
    })
}

export {
    loadEvents
}