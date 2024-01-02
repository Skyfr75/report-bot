const client = require('..');
const database = require('../Schemas/bans')

client.on('guildMemberAdd', async member => {
    let db = await database.findOne({UserID: member.id})
    if(db) {
        member.ban()
    }

});