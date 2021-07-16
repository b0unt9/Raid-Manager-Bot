const raidSchema = require('../database/raidSchema');

module.exports = async (guildId, raidId, memberId) => {
    try {
        let raidData = await raidSchema.findOne({guildId, raidId});

        if (!raidData) throw new Error('notExist');
        if (raidData.member.length === 8) throw new Error('fullMember');
        if (raidData.member.includes(memberId)) throw new Error('alreadyJoin');

        await raidData.member.push(memberId);
        await raidData.save();

        return raidData;
    } catch (err) {
        throw err;
    }
};