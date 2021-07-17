const guildSchema = require("../database/guildSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");

exports.run = async (client, message, args) => {
    return;
    if (!(await checkGuildAdmin(message))) return message.channel.send("**⚠️관리자만 해당 명령어를 사용할 수 있습니다**");

    let settings = await guildSchema.findOne({guildId: message.guild.id});

    if (args[0] === '추가' || args[0] === 'add') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            guildModel.allowCh = [message.channel.id];
            await guildModel.save();
            return message.channel.send(`**채널 ${message.channel.name}이(가) 명렁어 사용이 허가되었습니다**`);
        }

        if (!settings.allowCh.includes(message.channel.id)) {
            settings.allowCh.push(message.channel.id);
            await settings.save();
            return message.channel.send(`**채널 ${message.channel.name}이(가) 명렁어 사용이 허가되었습니다**`);
        }

        return message.channel.send("**⚠️이미 명령어 사용이 허가된 채널입니다**");
    } else if (args[0] === '삭제' || args[0] === 'remove') {
        if (!settings) {
            let guildModel = new guildSchema();
            guildModel.guildId = message.guild.id;
            await guildModel.save();
            return message.channel.send(`**채널 ${message.channel.name}은 명령어 사용이 금지되었습니다**`);
        }

        if (settings.allowCh.includes(message.channel.id)) {
            await settings.allowCh.splice(settings.allowCh.indexOf(message.channel.id), 1);
            await settings.save();
            return message.channel.send(`**채널 ${message.channel.name}이(가) 명렁어 사용이 금지되었습니다**`);
        }

        return message.channel.send("**⚠️이미 명령어 사용이 금지된 채널입니다**");
    } else {
        return message.channel.send("**⚠️명령어 인수가 누락되었습니다 (추가 또는 삭제)**");
    }
};

exports.config = {
    name: "명령어 채널 설정",
    commands: ["channel", "ch", "채널"]
};