module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        client.user.setPresence({
            activity: {
                name: `!? => 도움말 | ${client.guilds.cache.size}개의 서버`
            }
        });
    }, 10000);
    client.database.find({}, function(error, ch) {
        if (error) return console.log(error);
        if (!ch) return;
        ch.forEach(function(data) {
            try {
                client.channels.cache.get(data.channelid).messages.fetch({
                    around: data.textid,
                    limit: 1
                })
            } catch (error) {
                return;
            }
        })
    })
}