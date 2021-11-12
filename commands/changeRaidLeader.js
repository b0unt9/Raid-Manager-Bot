const raidSchema = require("../database/raidSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const updateInfo = require("../utils/updateInfo");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) throw 'emptyRaidID';
        if (isNaN(args[0]) || args[0].length !== 6) throw 'wrongRaidID';

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member.id) return message.channel.send("**⚠️변경할 공대장을 멘션 혹은 ID를 입력해주세요 (예시: /공대장 123456 @member#1234)**");

        let raidData = await raidSchema.findOne({guildId: message.guild.id, raidId: args[0]});
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");

        if (message.member.user.id !== raidData.master && !(await checkGuildAdmin(message))) return message.channel.send("**⚠️공대장만 공대장을 변경할 수 있습니다**");
        if (member.id === raidData.master) return message.channel.send("**⚠️이미 공대장입니다**");
        if (!raidData.member.includes(member.id)) return message.channel.send("**레이드에 참여한 사람으로만 공대장을 위임할 수 있습니다**");

        raidData.master = member.id;
        await raidData.save();

        let embed = await getEmbed(client, raidData, 5, member.id);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        await updateInfo(client, raidData, 5, member.id);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 공대장 변경",
    commands: ["공대장", "leader", "master"]
};