const mongo = require('mongoose');

const guildSchema = new mongo.Schema({
    GuildID: String,
    PublicLogsChannelID: String
})

module.exports = mongo.model('guild', guildSchema)