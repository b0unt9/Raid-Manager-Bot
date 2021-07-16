const raidSchema = require("../database/raidSchema");
const msgSchema = require("../database/msgSchema");
const schedule = require("node-schedule");
const moment = require("moment-timezone");

module.exports = () => {
    schedule.scheduleJob('0 */5 * * * *', async () => {
        let time = moment().tz("Asia/Seoul").subtract("1", "h");
        let limitTime = moment().tz("Asia/Seoul").subtract("24", "h");
        raidSchema.find({time: {"$lt": time}}).then(async (raidList) => {
            for (const raidData of raidList) {
                await msgSchema.deleteMany({raidId: raidData.raidId});
            }
            await raidSchema.deleteMany({time: {"$lt": time}});
        });
        raidSchema.find({limitTime: {"$lt": limitTime}}).then(async (raidList) => {
            for (const raidData of raidList) {
                await msgSchema.deleteMany({raidId: raidData.raidId});
            }
            await raidSchema.deleteMany({limitTime: {"$lt": limitTime}});
        });
    });
};