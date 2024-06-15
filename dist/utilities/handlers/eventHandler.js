"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = void 0;
const colors_1 = __importDefault(require("colors"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const loadEvents = (dir, client) => {
    const eventFiles = node_fs_1.default.readdirSync(dir);
    eventFiles.forEach(file => {
        const filesPath = node_path_1.default.join(dir, file);
        const stats = node_fs_1.default.statSync(filesPath);
        if (stats.isDirectory()) {
            loadEvents(filesPath, client);
        }
        else {
            try {
                const event = require(filesPath).default;
                if (!event)
                    console.warn(colors_1.default.red(`No default exporting in ${filesPath}`));
                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args, client));
                    console.log(colors_1.default.green(`Loaded ${event.name} event`));
                }
                else {
                    client.on(event.name, (...args) => event.run(...args, client));
                    console.log(colors_1.default.green(`Loaded ${event.name} event of dir ${filesPath}`));
                }
            }
            catch (error) {
                console.error(colors_1.default.red(`Error loading event: ${filesPath} : Error \n ${error}`));
                return;
            }
        }
    });
};
exports.loadEvents = loadEvents;
