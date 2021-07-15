const raidSchema = require("../database/raidSchema");
const schedule = require("node-schedule");
const moment = require("moment-timezone");

async function getTypeText(type) {
    if (type === 1)  return '칠흑';
    else if (type === 2) return '철마';
    else if (type === 3) return '칠흑&철마';
}

module.exports = async (client) => {
    schedule.scheduleJob('0 * * * * *', async () => {
        let now = moment().tz("Asia/Seoul").seconds(0).milliseconds(0).add("10", "m");
        let raidList = await raidSchema.find({time: now});
        try {
            if (!raidList || raidList.length === 0) return;
            for (const raidData of raidList) {
                let typeText = await getTypeText(raidData.type);
                let guildName = client.guilds.cache.get(raidData.guildId[0]).name;
                for (const raidMember of raidData.member) {
                    try {
                        await (await client.users.fetch(raidMember)).send(`**${guildName}**에서 ${typeText} 레이드가 10분 뒤 시작합니다. <@${raidMember}>`);
                    } catch (err) {
                        console.log(err);
                        continue;
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return;
        }
    });
};