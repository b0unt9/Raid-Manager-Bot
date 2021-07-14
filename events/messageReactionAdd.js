module.exports = (client, reaction, user) => {
    if (user.bot) return;
    if (reaction.emoji.name != "🤚") return;
    client.database.findOne({
        serverid: reaction.message.guild.id,
        textid: reaction.message.id
    }, function(error, raids) {
        if (error) return reaction.message.channel.send("**봇에 오류가 발생했습니다**");
        if (!raids) return;
        if (!raids.raidmember.includes(user.id)) {
            client.addMember(reaction.message.guild.id, raids.raidid, user.id, function(error, raids) {
                if (error == 'full') return reaction.message.channel.send(`**<@${user.id}>님 해당 레이드는 인원이 모두 찼습니다**`);
                else if (error) return reaction.message.channel.send(error);
                client.getEmbed(client, raids, 2, user.id, function(embed) {
                    reaction.message.edit(embed);
                });
            });
        } else {
            client.removeMember(reaction.message.guild.id, raids.raidid, user.id, function(error, raids) {
                if (error == 'raidmaster') return reaction.message.channel.send("**공대장은 레이드에서 나갈수 없습니다. 공대장을 변경후 시도해주세요**");
                else if (error) return reaction.message.channel.send(error);
                client.getEmbed(client, raids, 3, user.id, function(embed) {
                    reaction.message.edit(embed);
                });
            });
        };
    });
};