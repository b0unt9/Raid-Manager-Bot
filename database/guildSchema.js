const mongoose = require('mongoose');

let guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        index: true
    },
    allowCh: {
        type: [String]
    },
    adminRole: {
        type: [String]
    },
    adminMember: {
        type: [String]
    }
});

module.exports = mongoose.model('guild', guildSchema);