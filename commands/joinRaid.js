const addMember = require("../utils/addMember");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const updateInfo = require("../utils/updateInfo");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send("**⚠️참여할 레이드 ID를 입력해주세요**");
    try {
        let raidData = await addMember(message.guild.id, args[0], message.member.id);
        let embed = await getEmbed(client, raidData, 2, message.member.id);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        await updateInfo(client, raidData, 2, message.member.id);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
}

exports.config = {
    name: "레이드 참여",
    commands: ["참여", "join"]
};