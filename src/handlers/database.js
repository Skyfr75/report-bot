const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
module.exports = (client) => {
   mongoose.connect(client.config.Bot.MongoDBLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   }).then(() => console.log(`[Database]`.yellow + ' Connected to Mongo!'))
}