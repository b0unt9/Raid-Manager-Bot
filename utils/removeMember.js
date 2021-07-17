const raidSchema = require("../database/raidSchema");

module.exports = async (guildId, raidId, memberId) => {
    try {
        let raidData = await raidSchema.findOne({guildId, raidId});

        if (!raidData) throw 'notExist';
        if (memberId === raidData.master) throw 'raidMaster';
        if (!raidData.member.includes(memberId)) throw 'notMember';

        await raidData.member.splice(raidData.member.indexOf(memberId), 1);
        await raidData.save();

        return raidData;
    } catch (err) {
        throw err;
    }
};