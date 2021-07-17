const mongoose = require('mongoose');

let msgSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    chId: {
        type: String,
        required: true
    },
    msgId: {
        type: String,
        required: true,
        index: true
    },
    raidId: {
        type: Number,
        required: true,
        index: true
    }
});

module.exports = mongoose.model('msg', msgSchema);