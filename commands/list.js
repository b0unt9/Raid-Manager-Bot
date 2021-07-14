function getRaidtype(type, callback) {
    if (type === "칠흑" || type === "dh") {
        return callback(1);
    } else if (type === "철마" || type === "ih") {
        return callback(2);
    } else if (type === "흑마" || type === "di") {
        return callback(3);
    }
};

function getRaidtypetext(type, callback) {
    if (type === "칠흑" || type === "dh") {
        return callback('칠흑');
    } else if (type === "철마" || type === "ih") {
        return callback('철마');
    } else if (type === "흑마" || type === "di") {
        return callback('칠흑&철마');
    }
};

exports.run = (client, message, args) => {
    if (args[0]) {
        getRaidtype(args[0], function(raidtype) {
            client.database.find({
                serverid: message.guild.id,
                raidtype
            }).sort({
                "starttime": 1
            }).limit(3).then(function(raids) {
                if (raids == "") {
                    getRaidtypetext(args[0], function(raidtypetext) {
                        return message.channel.send(`"**모집 중인 ${raidtypetext} 레이드가 없습니다**"`);
                    })
                }
                raids.forEach(function(data) {
                    client.getEmbed(client, data, null, null, function(embed) {
                        message.channel.send(embed).then(function(message) {
                            client.setEmoji(message.guild.id, data.raidid, message.channel.id, message.id, function(error) {
                                if (error) return message.channel.send(error);
                                return message.react("🤚");
                            });
                        });
                    });
                });
            });
        })
    } else {
        client.database.find({
            serverid: message.guild.id
        }).sort({
            "starttime": 1
        }).limit(3).then(function(raids) {
            if (raids == "") return message.channel.send("**모집 중인 레이드가 없습니다**");
            raids.forEach(function(data) {
                client.getEmbed(client, data, null, null, function(embed) {
                    message.channel.send(embed).then(function(message) {
                        client.setEmoji(message.guild.id, data.raidid, message.channel.id, message.id, function(error) {
                            if (error) return message.channel.send(error);
                            return message.react("🤚");
                        });
                    });
                });
            });
        });
    };
};

exports.config = {
    name: "레이드 목록",
    aliases: ["!", "목록"]
};