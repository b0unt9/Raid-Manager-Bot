const raidSchema = require("../database/raidSchema");
const getEmbed = require("../utils/getEmbed");
const setMsgDB = require("../utils/setMsgDB");
const errorHandle = require("../utils/errorHandle");

async function getRaidType(type) {
    if (type === "칠흑" || type === "dh") {
        return '1';
    } else if (type === "철마" || type === "ih") {
        return '2';
    } else if (type === "흑마" || type === "di") {
        return '3';
    }
}

async function getRaidTypeText(type) {
    if (type === "칠흑" || type === "dh") {
        return '칠흑';
    } else if (type === "철마" || type === "ih") {
        return '철마';
    } else if (type === "흑마" || type === "di") {
        return '칠흑&철마';
    }
}

exports.run = async (client, message, args) => {
    let raidType, raidTypeText, filter;
    let raidTypeList = ['칠흑', '철마', '흑마', 'dh', 'ih', 'di'];
    if (args[0] && raidTypeList.includes(args[0])) {
        raidType = await getRaidType(args[0]);
        raidTypeText = await getRaidTypeText(args[0]);
        filter = {guildId: message.guild.id, type: raidType};
    } else if (args[0]) {
        return message.channel.send(`**⚠ 잘못된 레이드 종류 입니다 (칠흑, 철마, 흑마, dh, ih, di)**`);
    } else {
        filter = {guildId: message.guild.id};
    }

    raidSchema.find(filter)
        .sort({limitTime: 1})
        .limit(3)
        .then(async (raidList) => {
            if (raidList.length === 0) {
                if (raidType) return message.channel.send(`**⚠ 모집 중인 ${raidTypeText} 레이드가 없습니다**`);
                else return message.channel.send(`**⚠ 모집 중인 레이드가 없습니다**`);
            }

            try {
                for (const raidData of raidList) {
                    let embed = await getEmbed(client, raidData, 0, null);
                    let msg = await message.channel.send(embed);
                    await setMsgDB(msg.guild.id, msg.channel.id, msg.id, raidData.raidId);
                    await msg.react("🤚");
                }
            } catch (err) {
                let errMsg = await errorHandle(err);
                return message.channel.send(errMsg);
            }
        });
};

exports.config = {
    name: "레이드 목록",
    commands: ["list", "!", "목록", "l", "/"]
};