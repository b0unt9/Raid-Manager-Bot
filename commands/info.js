exports.run = (client, message, args) => {
    if (!args[0]) return message.channel.send("**세부사항을 수정할 레이드의 고유 ID를 입력해주세요**");
    client.database.findOne({
        serverid: message.guild.id,
        raidid: args[0]
    }, function(error, raids) {
        if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        if (!raids) return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        if (message.member.user.id != raids.raidmaster && !message.member.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**공대장만 세부사항을 수정할 수 있습니다**");
        if (!args[1]) raids.raiddetail = '세부정보가 없습니다';
        else raids.raiddetail = args.splice(1).join(" ");
        raids.save().then(function() {
            client.getEmbed(client, raids, 7, null, function(embed) {
                message.channel.send(embed).then(function(message) {
                    client.setEmoji(message.guild.id, raids.raidid, message.channel.id, message.id, function(error) {
                        if (error) return message.channel.send(error);
                        return message.react("🤚");
                    });
                });
            });
        });
    });
};

exports.config = {
    name: "레이드 세부정보 수정",
    aliases: ["정보"]
};