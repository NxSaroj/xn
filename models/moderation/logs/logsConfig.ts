import { Schema, model } from 'mongoose'

const logsConfig = new Schema({
  channelId: String,
  guildId: String,
  messageLog: {
    type: Boolean,
    default: true,
  },
  channelLog: {
    type: Boolean,
    default: true,
  },
  welcomeLog: {
    type: Boolean,
    default: true,
  },
  modLog: {
    type: Boolean,
    default: true,
  },
});

export default model("logsConfig", logsConfig);
