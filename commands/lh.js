exports.run = (client, message, args) => {
    client.timeCheck(args, function(error, date) {
        if (error) return message.channel.send(error);
        client.createRaid(message.guild.id, 2, message.member.user.id, date, function(error, raids) {
            if (error) return message.channel.send(error);
            client.getEmbed(client, raids, 1, raids.raidmaster, function(embed) {
                message.channel.send(embed).then(function(message) {
                    client.setEmoji(message.guild.id, raids.raidid, message.channel.id, message.id, function(error) {
                        if (error) return message.channel.send(error);
                        return message.react("🤚");
                    });
                });
            });
        });
    });
}

exports.config = {
    name: "철마 레이드 생성",
    aliases: ["철마"]
}