const raidSchema = require("../database/raidSchema");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) throw 'emptyRaidID';
        if (isNaN(args[0]) || args[0].length !== 6) throw 'wrongRaidID';

        let raidData = await raidSchema.findOne({raidId: args[0]});
        if (!raidData) return message.channel.send("**⚠️해당 레이드는 존재하지 않습니다**");
        if (message.member.id !== raidData.master) return message.channel.send("**⚠️해당 레이드의 공대장만 가져올 수 있습니다**");
        if (raidData.guildId.includes(message.guild.id)) return message.channel.send("**⚠️해당 레이드는 이미 서버에 존재합니다**");

        await raidData.guildId.push(message.guild.id);
        await raidData.save();

        let embed = await getEmbed(client, raidData, 8, null);
        let msg = await message.channel.send(embed);
        await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
        return msg.react("🤚");

    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "레이드 가져오기",
    commands: ["bring", "불러오기", "가져오기", "get"]
};