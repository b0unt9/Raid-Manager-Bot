const Discord = require('discord.js');
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        let embed = new Discord.MessageEmbed();
        embed.setTitle('디비전 레이드 명령어')
            .setAuthor(`${client.user.name}`, `${client.user.displayAvatarURL()}`, '')
            .setDescription('디비전2 레이드 모집을 간편하게 도와주는 디스코드 봇\n<>은 필수 인수, ()은 선택 인수')
            .setFooter('개발 : SideToy / 운영 : FlareBrick / 문의 : dbots@flarebrick.com')
            .addField('명령어 안내', '/도움말, /명령어, /help, /cmd')
            .addField('봇 추가 안내', '/초대, /invite')
            .addField('레이드 목록', '// (칠흑, 철마, 흑마), /목록 (칠흑, 철마, 흑마), /list (dh, ih, di), /l (dh, ih, di)')
            .addField('레이드 참여', '/참여 <레이드 ID>, /join <Raid ID>')
            .addField('레이드 나가기', '/나가기 <레이드 ID>, /불참 <레이드 ID>, /leave <Raid ID>')
            .addField('칠흑 레이드 생성', '/칠흑 (n시 m분), /dh (n시 m분)')
            .addField('철마 레이드 생성', '/철마 (n시 m분), /ih (n시 m분)')
            .addField('칠흑&철마 레이드 생성', '/흑마 (n시 m분), /di (n시 m분)')
            .addField('공대장 변경', '/공대장 <레이드 ID> <@멤버>, /leader <Raid ID> <@member>')
            .addField('레이드 시간 변경', '/시간 (n시 m분), /time (n시 m분)')
            .addField('레이드 삭제', '/삭제 <레이드 ID>, /delete <Raid ID>')
            .addField('레이드 가져오기', '/가져오기 <레이드 ID>, /get <Raid ID>');

        return message.channel.send(embed);
    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "도움말",
    commands: ["도움말", "명령어", "help", "cmd"]
};