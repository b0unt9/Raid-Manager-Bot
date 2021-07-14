exports.run = (client, message, args) => {
    if (!args[0]) return message.channel.send("**참여할 레이드의 고유 ID를 입력해주세요**");
    client.addMember(message.guild.id, args[0], message.member.id, function(error, raids) {
        if (error == 'full') return message.channel.send("**해당 ID의 레이드는 인원이 모두 찼습니다**");
        else if (error == 'already') return message.channel.send("**이미 해당ID의 레이드에 참여했습니다**");
        else if (error == 'nonraid') return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        else if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        client.getEmbed(client, raids, 2, message.member.id, function(embed) {
            message.channel.send(embed).then(function(message) {
                client.setEmoji(message.guild.id, args[0], message.channel.id, message.id, function(error) {
                    if (error) return message.channel.send(error);
                    return message.react("🤚");
                });
            });
        });
    });
};

exports.config = {
    name: "레이드 참여",
    aliases: ["참여"]
};