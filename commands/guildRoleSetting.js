const guildSchema = require("../database/guildSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");

exports.run = async (client, message, args) => {
    return;
    if (!(await checkGuildAdmin(message))) return message.channel.send("**⚠️관리자만 해당 명령어를 사용할 수 있습니다**");

    let role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.name === args[1]) || message.guild.roles.cache.get(args[1]);
    if (!args[0] || !role) return message.channel.send("**⚠️명령어 인수(추가 또는 삭제 또는 역할)가 누락되었습니다**");

    let settings = await guildSchema.findOne({guildId: message.guild.id});

    if (args[0] === '추가' || args[0] === 'add') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            guildModel.adminRole = [role.id];
            await guildModel.save();
            return message.channel.send(`**역할 ${role.name}이(가) 관리자 권한을 취득하였습니다**`);
        }

        if (!settings.adminRole.includes(role.id)) {
            settings.adminRole.push(role.id);
            await settings.save();
            return message.channel.send(`**역할 ${role.name}이(가) 관리자 권한을 취득하였습니다**`);
        }

        return message.channel.send("**⚠️이미 관리자 권한이 취득된 역할입니다**");
    } else if (args[0] === '삭제' || args[0] === 'remove') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            await guildModel.save();
            return message.channel.send(`**⚠️이미 관리자 권한이 없는 역할입니다**`);
        }

        if (settings.adminRole.includes(message.channel.id)) {
            await settings.adminRole.splice(settings.adminRole.indexOf(message.channel.id), 1);
            await settings.save();
            return message.channel.send(`**역할 ${role.name}의 관리자 권한이 박탈되었습니다**`);
        }

        return message.channel.send("**⚠️이미 관리자 권한이 없는 역할입니다**");
    } else {
        return message.channel.send("**⚠️명령어 인수가 누락되었습니다 (추가 또는 삭제)**");
    }
};

exports.config = {
    name: "관리자 역할 설정",
    commands: ["role", "역할"]
};