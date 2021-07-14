const db = require('./database');
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 5);

module.exports = async function createRaid(serverid, raidtype, raidmaster, date, cb) {
    let raidModel = new db();
    let raid_id = null;
    while (1) {
        raid_id = await nanoid();
        if (await db.exists({raidid: raid_id})) continue;
        else break;
    }
    raidModel.serverid = serverid;
    raidModel.raidid = raid_id;
    raidModel.raidtype = raidtype;
    raidModel.raidmaster = raidmaster;
    raidModel.raidmember = [raidmaster];
    if (!date) {
        raidModel.starttime = date;
        raidModel.raiddetail = '출발시간이 정해지지 않았습니다';
    } else {
        raidModel.starttime = date;
        raidModel.raiddetail = '세부정보가 없습니다';
    }
    raidModel.save().then(function () {
        return cb(null, raidModel);
    });
};