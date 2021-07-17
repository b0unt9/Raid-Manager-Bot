const raidSchema = require("../database/raidSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");
const removeMember = require("../utils/removeMember");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const updateInfo = require("../utils/updateInfo");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!args[0]) return message.channel.send("**⚠️공대원을 강제 퇴출 할 레이드 ID를 입력해주세요 (예시: /강퇴 123456 @member#1234)**");
    if (!member.id) return message.channel.send("**⚠️강제 퇴출할 공대원을 멘션 혹은 ID를 입력해주세요 (예시: /강퇴 123456 @member#1234)**");
    let raidData = await raidSchema.findOne({guildId: message.guild.id, raidId: args[0]});
    try {
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");
        if (message.member.user.id !== raidData.master && !(await checkGuildAdmin(message))) return message.channel.send("**⚠️공대장만 공대원을 강제 퇴출 할 수 있습니다**");
        if (member.id === raidData.master) return message.channel.send("**⚠️공대장을 레이드에서 강제 퇴출 할 수 없습니다**")
        let raidData = await removeMember(message.guild.id, args[0], member.id);
        let embed = await getEmbed(client, raidData, 4, member.id);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        await updateInfo(client, raidData, 4, member.id);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 공대원 강제 퇴출",
    commands: ["강퇴", "kick"]
};