const Discord = require('discord.js');
const moment = require('moment-timezone');
moment.locale('ko');

async function getTypeText(type) {
    if (type === 1)  return '칠흑';
    else if (type === 2) return '철마';
    else if (type === 3) return '칠흑&철마';
}

async function getDiffMsg(diffCode, eventMember, typeText) {
    if (diffCode === 1) return `<@${eventMember}>님 께서 ${typeText} 레이드를 생성했습니다.`;
    else if (diffCode === 2) return `<@${eventMember}>님 께서 레이드에 참여했습니다.`;
    else if (diffCode === 3) return `<@${eventMember}>님 께서 레이드에서 나가셨습니다`;
    else if (diffCode === 4) return `<@${eventMember}>님 께서 레이드에서 강제 퇴출 되었습니다`;
    else if (diffCode === 5) return `<@${eventMember}>님 께서 레이드의 공대장이 되었습니다`;
    else if (diffCode === 6) return `레이드의 출발 시간이 변경되었습니다`;
    else if (diffCode === 7) return `레이드의 정보가 변경되었습니다`;
    else if (diffCode === 8) return `레이드를 가져왔습니다`;
    else if (diffCode === 9) return `레이드가 삭제되었습니다`;
    else return null;
}

module.exports = async (client, raidInfo, diffCode, eventMember) => {
    try {
        let embed = new Discord.MessageEmbed();

        let typeText = await getTypeText(raidInfo.type);
        let diffMsg = await getDiffMsg(diffCode, eventMember, typeText);

        let memberList = "";

        await raidInfo.member.forEach(member => {
            memberList += `<@${member}> `
        });

        embed.setAuthor('디비전 레이드', `${client.user.displayAvatarURL()}`, '');

        if (raidInfo.time) {
            embed.setTitle(`${moment(raidInfo.time).tz("Asia/Seoul").format("MM월 DD일 a h시 mm분")} ${typeText} 레이드 모집중`);
            embed.addField("시작 시각", `${moment(raidInfo.time).tz("Asia/Seoul").format("MM월 DD일 a h시 mm분")}`, true);
        } else {
            embed.setTitle(`${typeText} 레이드 모집중`);
            embed.addField("시작 시각", `미정 혹은 세부정보 참조`, true);
        }

        embed.addField("레이드 ID", raidInfo.raidId, true)
            .addField("공대장", `<@${raidInfo.master}>`, true)
            .addField("세부정보", raidInfo.info)
            .addField(`공대원 (${raidInfo.member.length}/8)`, memberList)
            .setFooter(`참여방법: 🤚를 누르거나 !참여 ${raidInfo.raidId}`)
            .setTimestamp();

        if (diffMsg) embed.addField("변경 사항", diffMsg);

        return embed;
    } catch (err) {
        throw err;
    }
};