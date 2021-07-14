exports.run = (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member,
        user = member.user;
    if (!args[0]) return message.channel.send("**공대원을 강제 퇴출 할 레이드의 고유 ID를 입력해주세요 (예시: !강퇴 1234567 @member#1234)**");
    if (!member.id) return message.channel.send("**강제 퇴출할 공대원을 멘션 혹은 ID를 입력해주세요 (예시: !강퇴 1234567 @member#1234)**");
    client.database.findOne({
        serverid: message.guild.id,
        raidid: args[0]
    }, function(error, raids) {
        if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        if (!raids) return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        if (message.member.user.id != raids.raidmaster && !message.member.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**공대장만 공대장을 변경할 수 있습니다**");
        client.removeMember(message.guild.id, args[0], member.id, function(error, raids) {
            if (error == 'nonmember') return message.channel.send("**해당 멤버는 해당 ID의 레이드에 참여하지 않았습니다**");
            else if (error == 'raidmaster') return message.channel.send("**공대장은 레이드에서 강제 퇴출 할 수 없습니다**");
            else if (error == 'nonraid') return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
            else if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
            client.getEmbed(client, raids, 4, member.id, function(embed) {
                message.channel.send(embed).then(function(message) {
                    client.setEmoji(message.guild.id, args[0], message.channel.id, message.id, function(error) {
                        if (error) return message.channel.send(error);
                        return message.react("🤚");
                    });
                });
            });
        });
    });
};

exports.config = {
    name: "레이드 공대원 강제 퇴출",
    aliases: ["강퇴"]
};