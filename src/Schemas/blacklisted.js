const mongo = require('mongoose');

const blacklistedSchema = new mongo.Schema({
    UserID: String,
    isBlacklisted: Boolean
})

module.exports = mongo.model('blacklist', blacklistedSchema)