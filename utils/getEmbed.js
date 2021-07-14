const Discord = require('discord.js');
const moment = require('moment');
require('moment-timezone');
moment.locale('ko');

/*
[Diffcode]
1: 생성
2: 참여
3: 불참
4: 강퇴
5: 공대장변경
6: 시간변경
7: 정보변경
*/

async function getRaidtype(typenum) {
    if (typenum === 1)  return '칠흑';
    else if (typenum === 2) return '철마';
    else if (typenum === 3) return '칠흑&철마';
};

async function getDiffmessage(diffcode, eventmember, raidtypetext) {
    if (diffcode === 1) return `<@${eventmember}>님 께서 ${raidtypetext} 레이드를 생성했습니다.`;
    else if (diffcode === 2) return `<@${eventmember}>님 께서 레이드에 참여했습니다.`;
    else if (diffcode === 3) return `<@${eventmember}>님 께서 레이드에서 나가셨습니다`;
    else if (diffcode === 4) return `<@${eventmember}>님 께서 레이드에서 강제 퇴출 되었습니다`;
    else if (diffcode === 5) return `<@${eventmember}>님 께서 레이드의 공대장이 되었습니다`;
    else if (diffcode === 6) return `레이드의 출발 시간이 변경되었습니다`;
    else if (diffcode === 7) return `레이드의 정보가 변경되었습니다`;
};

module.exports = async function getEmbed(client, raid, diffcode, eventmember) {
    let raidtypetext = await getRaidtype(raid.raidtype);
    let diffmessage = await getDiffmessage(diffcode, eventmember, raidtypetext);
    let raidmemberlist = "", embed = new Discord.MessageEmbed();

    await raid.raidmember.forEach(function (data) {
        raidmemberlist += `<@${data}> `
    })

    embed.setColor(Math.floor(Math.random() * 16777214) + 1)
        .setAuthor('디비전 레이드', `${client.user.displayAvatarURL()}`, '')

    if (raid.starttime) {
        embed.setTitle(`${moment(raid.starttime).format("MM월 DD일 a h시 mm분")} ${raidtypetext} 레이드 모집중`)
            .addField("시작 시각", `${moment(raid.starttime).format("MM월 DD일 a h시 mm분")}`, true)
    } else {
        embed.setTitle(`${raidtypetext} 레이드 모집중`)
    }

    embed.addField("고유 ID", raid.raidid, true)
        .addField("공대장", `<@${raid.raidmaster}>`, true)
        .addField("세부정보", raid.raiddetail)
        .addField(`공대원 (${raid.raidmember.length}/8)`, raidmemberlist)
        .setFooter(`참여방법: 🤚를 누르거나 !참여 ${raid.raidid}`)
        .setTimestamp();

    if (diffmessage) embed.addField("변경 사항", diffmessage);

    return embed;
};