const db = require('./database');

module.exports = function addMember(serverid, raidid, memberid, cb) {
    db.findOne({
        serverid,
        raidid
    }, function(error, raids) {
        if (error) return cb(error, null);
        if (!raids) return cb('nonraid', null);
        if (raids.raidmember.length === 8) return cb('full', null);
        if (raids.raidmember.includes(memberid)) return cb('already', null);
        raids.raidmember.push(memberid);
        raids.save().then(function() {
            return cb(null, raids);
        });
    });
};