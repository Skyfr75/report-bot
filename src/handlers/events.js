const fs = require('fs');
const colors = require('colors');
module.exports = (client) => {
    fs.readdirSync('./src/events').filter((file) => file.endsWith('.js')).forEach((event) => {
        require(`../events/${event}`);
    });
    console.log(`[Success]`.green + ` Events loaded`);
}