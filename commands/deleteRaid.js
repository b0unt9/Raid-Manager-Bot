const raidSchema = require("../database/raidSchema");
const msgSchema = require("../database/msgSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");
const updateInfo = require("../utils/updateInfo");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) throw 'emptyRaidID';
        if (isNaN(args[0]) || args[0].length !== 6) throw 'wrongRaidID';

        let raidData = await raidSchema.findOne({raidId: args[0]})
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");

        if (message.member.user.id !== raidData.master && !(await checkGuildAdmin(message))) return message.channel.send("**⚠️공대장만 레이드를 삭제 할 수 있습니다**");

        await raidSchema.deleteOne({raidId: args[0]});
        await updateInfo(client, raidData, 9, null);
        await msgSchema.deleteMany({raidId: args[0]});
        return message.channel.send(`**${raidData.raidId} 레이드가 삭제되었습니다**`);
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 삭제",
    commands: ["remove", "삭제", "delete", "취소", "cancel"]
};