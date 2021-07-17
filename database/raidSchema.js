const mongoose = require('mongoose');

let raidSchema = new mongoose.Schema({
    raidId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    guildId: {
        type: [String],
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    master: {
        type: String,
        required: true
    },
    member: {
        type: [String],
        required: true
    },
    info: {
        type: String,
        default: "세부정보가 없습니다"
    },
    time: {
        type: Date
    },
    limitTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('raid', raidSchema);