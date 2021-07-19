const mongoose = require('mongoose');

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('123456789', 6);

const orgDatabaseUrl = '';

let orgSchema = new mongoose.Schema({
    serverid: String, //레이드 진행 Guild ID
    raidid: String, //레이드 고유 ID
    raidtype: Number, //레이드 종류 (1: 칠흑 2: 철마 3: 칠흑&철마)
    raidmaster: String, //레이드 공대장
    raidmember: [String], //레이드 공대원 리스트
    raiddetail: String, //레이드 세부정보
    channelid: String, //최근 레이드 안내 메세지 채널 ID
    textid: String, //최근 레이드 안내 메세지 ID
    starttime: Date //레이드 시작 예정 시각
});

const orgRaidSchema = mongoose.model('raid', orgSchema);
const newRaidSchema = require('./database/raidSchema');
const newMsgSchema = require('./database/msgSchema');

async function main() {
    await mongoose.connect(orgDatabaseUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    });

    orgRaidSchema.find({})
        .then(async (orgRaidList) => {
            if (orgRaidList.length === 0) return;
            for (const orgRaidData of orgRaidList) {
                let newRaidId;

                while (1) {
                    newRaidId = await nanoid();
                    if (await newRaidSchema.exists({newRaidId})) continue;
                    else break;
                }

                let newRaid = new newRaidSchema();
                newRaid.raidId = newRaidId;
                newRaid.guildId = [orgRaidData.serverid];
                newRaid.type = orgRaidData.raidtype;
                newRaid.master = orgRaidData.raidmaster;
                newRaid.member = orgRaidData.raidmember;
                newRaid.info = orgRaidData.raiddetail
                newRaid.time  = orgRaidData.starttime;
                newRaid.limitTime = orgRaidData.starttime;

                let newMsg = new newMsgSchema();
                newMsg.guildId = orgRaidData.serverid
                newMsg.chId = orgRaidData.channelid
                newMsg.msgId = orgRaidData.textid
                newMsg.raidId = newRaidId;

                await newRaid.save();
                await newMsg.save();
            }

            process.exit();
        });
};

main();