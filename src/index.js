const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')

const yaml = require('js-yaml')
const fs = require('fs');
const config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, 'utf8'))
const colors = require('colors')

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.User,
      Partials.GuildMember,
      Partials.Reaction
    ],
    presence: {
      activities: [{
        name: config.Bot.ActivityName,
        type: 0
      }],
      status: 'dnd'
    }
  });

client.commands = new Collection();
client.config = config

module.exports = client;

fs.readdirSync('./src/handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.Bot.BotToken);

process.on('unhandledRejection', async (err, promise) => {
  if(err.toString().includes(`TypeError: Cannot read properties of undefined (reading 'ban')`)) return
  if(err.toString().includes('Unknown interaction')) return
    console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
    console.error(promise);
  });
  
process.on("uncaughtException", (err) => {
    console.error('Uncaught Exception:', err); 
    if(err.toString().startsWith("database.create")) return
 });