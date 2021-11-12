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

        let raidData = await raidSchema.findOne({guildId: message.guild.id, raidId: args[0]});
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");

        if (message.member.user.id !== raidData.master && !(await checkGuildAdmin(message))) return message.channel.send("**⚠️공대장만 세부정보를 변경할 수 있습니다**");

        if (!args[1]) raidData.info = '세부정보가 없습니다';
        else raidData.info = args.splice(1).join(" ");

        await raidData.save();

        let embed = await getEmbed(client, raidData, 7, null);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        await updateInfo(client, raidData, 7, null);
        return msg.react("🤚");
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 세부정보 변경",
    commands: ["정보", "info", "notice"]
};