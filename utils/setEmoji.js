const db = require('./database');

module.exports = function setEmoji(serverid, raidid, channelid, textid, cb) {
    db.findOne({
        serverid,
        raidid
    }, function(error, emoji) {
        if (error) return cb(error);
        emoji.textid = textid;
        emoji.channelid = channelid;
        emoji.save().then(function() {
            return cb(null);
        })
    })
}