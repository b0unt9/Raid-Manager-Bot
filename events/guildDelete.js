module.exports = (client, guild) => {
    client.database.deleteMany({
        serverid: guild.id
    }).then(function() {
        return;
    });
}