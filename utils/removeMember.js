const db = require('./database');

module.exports = function removeMember(serverid, raidid, memberid, cb) {
    db.findOne({
        serverid,
        raidid
    }, function(error, raids) {
        if (error) return cb(error, null);
        if (!raids) return cb('nonraid', null);
        if (memberid === raids.raidmaster) return cb('raidmaster', null);
        if (!raids.raidmember.includes(memberid)) return cb('nonmember', null);
        raids.raidmember.splice(raids.raidmember.indexOf(memberid), 1);
        raids.save().then(function() {
            return cb(null, raids);
        });
    });
};