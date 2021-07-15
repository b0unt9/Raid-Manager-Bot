exports.run = (client, message, args) => {
    if (!args[0]) return message.channel.send("**불참할 레이드의 고유 ID를 입력해주세요.**");
    client.removeMember(message.guild.id, args[0], message.member.id, function(error, raids) {
        if (error == 'nonmember') return message.channel.send("**해당 ID의 레이드에 참여하지 않았습니다**");
        else if (error == 'raidmaster') return message.channel.send("**공대장은 레이드에서 나갈 수 없습니다. 공대장을 변경후 시도해주세요**");
        else if (error == 'nonraid') return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        else if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        client.getEmbed(client, raids, 3, message.member.id, function(embed) {
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
    name: "레이드 불참",
    aliases: ["불참", "나가기"]
};