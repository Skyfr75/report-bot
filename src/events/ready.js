const client = require('..');
const colors = require('colors');

client.on('ready', () => {

    console.log(`[Success]`.green + ` Logged in as ${client.user.tag}, watching ${client.guilds.cache.size} servers`);

});