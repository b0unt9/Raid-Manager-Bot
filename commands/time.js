const moment = require('moment');
require('moment-timezone');
moment.locale('ko');

function getRaidcount(client, serverid, date, cb) {
    client.database.countDocuments({
        serverid,
        raidid: {
            $gte: moment(date).format("DDHHmm") + '0'
        }
    }, function(error, raidcount) {
        if (error) return cb(error, null);
        return cb(null, String(Number(raidcount) + 1));
    });
};

exports.run = (client, message, args) => {
    if (!args[0]) return message.channel.send("**출발 시각을 변경할 레이드의 고유 ID를 입력해주세요**");
    client.timeCheck(args.splice(1), function(error, date) {
        if (error) return message.channel.send(error);
        client.database.findOne({
            serverid: message.guild.id,
            raidid: args[0]
        }, function(error, raids) {
            if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
            if (!raids) return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
            if (message.member.user.id != raids.raidmaster && !message.member.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**공대장만 출발 시각을 변경할 수 있습니다**");
            getRaidcount(client, message.guild.id, date, function(error, raidcount) {
                if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
                raids.raidid = `${moment(date).tz("Asia/Seoul").format("DDHHmm")}${raidcount}`;
                raids.starttime = date;
                raids.save();
                client.getEmbed(client, raids, 6, null, function(embed) {
                    message.channel.send(embed).then(function(message) {
                        client.setEmoji(message.guild.id, raids.raidid, message.channel.id, message.id, function(error) {
                            if (error) return message.channel.send(error);
                            return message.react("🤚");
                        });
                    });
                });
            });
        });
    });
};

exports.config = {
    name: "레이드 출발 시각 변경",
    aliases: ["시각", "시작", "출발", "start"]
};