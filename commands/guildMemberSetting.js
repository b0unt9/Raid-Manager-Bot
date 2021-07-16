const guildSchema = require("../database/guildSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");

exports.run = async (client, message, args) => {
    if (!(await checkGuildAdmin(message))) return message.channel.send("**⚠️관리자만 해당 명령어를 사용할 수 있습니다**");

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!args[0] || !member) return message.channel.send("**⚠️명령어 인수(추가 또는 삭제 또는 멤버)가 누락되었습니다**");

    let settings = await guildSchema.findOne({guildId: message.guild.id});

    if (args[0] === '추가' || args[0] === 'add') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            guildModel.adminMember = [member.id];
            await guildModel.save();
            return message.channel.send(`**<@${member.id}>이(가) <@${message.member.user.id}>에 의해 레이드 관리자 권한을 취득하였습니다**`);
        }

        if (!settings.adminMember.includes(member.id)) {
            settings.adminMember.push(member.id);
            await settings.save();
            return message.channel.send(`**<@${member.id}>이(가) <@${message.member.user.id}>에 의해 레이드 관리자 권한을 취득하였습니다**`);
        }

        return message.channel.send("**⚠️이미 관리자 권한이 있는 프로필입니다**");
    } else if (args[0] === '삭제' || args[0] === 'remove') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            await guildModel.save();
            return message.channel.send(`**⚠️<@${member.id}>은 관리자 권한이 없습니다**`);
        }

        if (settings.adminMember.includes(member.id)) {
            await settings.adminMember.splice(settings.adminMember.indexOf(member.id), 1);
            await settings.save();
            return message.channel.send(`**<@${member.id}>이(가) <@${message.member.user.id}>에 의해 레이드 관리자 권한을 박탈되었습니다**`);
        }

        return message.channel.send(`**⚠️<@${member.id}>은 관리자 권한이 없습니다**`);
    } else {
        return message.channel.send("**⚠️명령어 인수(추가 또는 삭제 또는 멤버)가 누락되었습니다**");
    }
};

exports.config = {
    name: "레이드 관리자 설정",
    commands: ["admin", "관리자"]
};