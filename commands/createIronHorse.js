const timeCheck = require("../utils/timeCheck");
const createRaid = require("../utils/createRaid");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        let date = await timeCheck(args);
        let raidData = await createRaid(message.guild.id, 2, message.member.user.id, date);
        let embed = await getEmbed(client, raidData, 1, raidData.master);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "철마 레이드 생성",
    commands: ["철마", "ih"]
};