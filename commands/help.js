const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setAuthor('디비전 레이드', `${client.user.displayAvatarURL()}`, '')
        .setTitle(`레이드봇 정보 & 도움말`)
        .setDescription("디비전2 레이드 구성에 도움을 주는 디스코드 봇\n칠흑=>dh, 철마=>ih, 흑마(칠흑 + 철마)=>di")
        .addField("도움말", "!?, !도움말, !help, !h")
        .addField("봇 초대 링크", "!초대, !invite")
        .addField("레이드 목록", "!!, !목록, !list, !목록 <철마, 칠흑, 흑마, dh, ih, di>, !list <철마, 칠흑, 흑마, dh, ih, di>")
        .addField("레이드 참여", "!참여 1234567, !join 1234567\n또는 🤚클릭")
        .addField("레이드 참여 취소", "!불참 1234567, !leave 1234567\n또는 🤚클릭")
        .addField("레이드 만들기", "!칠흑 10시\n!철마 22시 30분\n!철마 내일 20시 30분\n!lh 10시\n!dh 내일 20시 30분")
        .addField("레이드 세부정보 추가&변경", "!정보 1234567 세부정보, !info 1234567 raiddetail")
        .addField("레이드 공대장 변경", "!공대장 1234567 @leader, !leader 1234567 @leader")
        .addField("레이드 공대원 강퇴", "!강퇴 1234567 @member, !kick 1234567 @member")
        .addField("레이드 삭제", "!삭제 1234567, !remove 1234567")
        .addField("레이드 시작 시각 변경", "!시작 1234567 10시, !시작 1234567 내일 20시 30분, !time 1234567 10시, !time 1234567 내일 20시 30분")
        .setFooter("문의 : dbots@flarebrick.com / 담당자 : SYSTEM#6353")
        .setTimestamp();
    return message.channel.send(embed);
}

exports.config = {
    name: "도움말",
    aliases: ["?", "h", "도움말"]
}