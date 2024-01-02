const client = require('..');
const database = require('../Schemas/guild')

client.on('guildCreate', async guild => {
    await database.findOne({GuildID: guild.id}) || await database.create({GuildID: guild.id})
    console.log(`I was added to the guild ${guild.name}`)

});