exports.run = (client, message, args) => {
    if (!args[0]) return message.channel.send("**삭제할 레이드의 고유 ID를 입력해주세요**");
    client.database.findOne({
        serverid: message.guild.id,
        raidid: args[0]
    }, function(error, raids) {
        if (error) return message.channel.send("**봇에 오류가 발생했습니다**");
        if (!raids) return message.channel.send("**해당 ID의 레이드는 존재하지 않습니다**");
        if (message.member.user.id != raids.raidmaster && !message.member.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send("공대장만 레이드를 삭제할 수 있습니다");
        client.database.deleteOne({
            serverid: message.guild.id,
            raidid: args[0]
        }).then(() => {
            return message.channel.send(`**${args[0]} 레이드가 삭제되었습니다**`);
        });
    });
};

exports.config = {
    name: "레이드 삭제",
    aliases: ["삭제"]
};