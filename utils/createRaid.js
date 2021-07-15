const raidSchema = require("../database/raidSchema");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('123456789', 6);
const moment = require('moment-timezone');

module.exports = async (guildId, type, master, time) => {
    try {
        let raidModel = new raidSchema();
        let raidId;

        while (1) {
            raidId = await nanoid();
            if (await raidSchema.exists({raidId})) continue;
            else break;
        }

        raidModel.raidId = raidId;
        raidModel.guildId = [guildId];
        raidModel.type = type;
        raidModel.master = master;
        raidModel.member = [master];

        if (time) {
            raidModel.time = time;
            raidModel.limitTime = time;
        } else {
            raidModel.limitTime = moment().add('1', 'days');
            raidModel.info = "출발시간이 정해지지 않았습니다";
        }

        await raidModel.save();

        return raidModel;
    } catch (err) {
        throw err;
    }
};