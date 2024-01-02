const mongo = require('mongoose');

const bansSchema = new mongo.Schema({
    UserID: String,
    username: String,
    StaffMember: String,
    Reason: String,
    Date: String,
    Time: String,
})

module.exports = mongo.model('bans', bansSchema)