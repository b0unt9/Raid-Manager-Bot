const moment = require('moment-timezone');

const raidSchema = require("../database/raidSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");
const timeCheck = require("../utils/timeCheck");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const updateInfo = require("../utils/updateInfo");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) throw 'emptyRaidID';
        if (isNaN(args[0]) || args[0].length !== 6) throw 'wrongRaidID';

        let raidData = await raidSchema.findOne({guildId: message.guild.id, raidId: args[0]});
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");
        if (message.member.user.id !== raidData.master && !(await checkGuildAdmin(message))) return message.channel.send("**⚠️공대장만 공대장을 변경할 수 있습니다**");

        let date = await timeCheck(args.splice(1));

        if (date) {
            raidData.time = date;
            raidData.limitTime = date;
        } else {
            raidData.time = null;
            raidData.limitTime = moment().add('1', 'days');
        }

        await raidData.save();

        let embed = await getEmbed(client, raidData, 6, null);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        await updateInfo(client, raidData, 6, null);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 시작 시간 변경",
    commands: ["시각", "시작", "출발", "start", "time"]
};