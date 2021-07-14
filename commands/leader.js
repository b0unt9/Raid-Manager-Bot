exports.run = (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member,
        user = member.user;
    if (!args[0]) return message.channel.send("**공대장을 변경할 레이드의 고유 ID를 입력해주세요 (예시: !공대장 1234567 @member#1234)**");
    if (!member.id) return message.channel.send("**변경할 공대장을 멘션 혹은 ID를 입력해주세요 (예시: !공대장 1234567 @member#1234)**");
    client.database.findOne({
        serverid: message.guild.id,
        raidid: args[0]
    }, function(error, raids) {
        if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        if (!raids) return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        if (message.member.user.id != raids.raidmaster && !message.member.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send("**공대장만 공대장을 변경할 수 있습니다**");
        if (!raids.raidmember.includes(member.id)) return message.channel.send("**레이드에 참여한 사람으로만 공대장으로 변경할 수 있습니다**");
        raids.raidmaster = member.id;
        raids.save().then(function() {
            client.getEmbed(client, raids, 5, member.id, function(embed) {
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
    name: "레이드 공대장 변경",
    aliases: ["공대장"]
};