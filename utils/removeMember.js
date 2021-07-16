const raidSchema = require("../database/raidSchema");

module.exports = async (guildId, raidId, memberId) => {
    try {
        let raidData = await raidSchema.findOne({guildId, raidId});

        if (!raidData) throw new Error('notExist');
        if (memberId === raidData.master) throw new Error('raidMaster');
        if (!raidData.member.includes(memberId)) throw new Error('notMember');

        await raidData.member.splice(raidData.member.indexOf(memberId), 1);
        await raidData.save();

        return raidData;
    } catch (err) {
        throw err;
    }
};