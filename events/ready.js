const msgSchema = require("../database/msgSchema");

module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(async () => {
        await client.user.setPresence({
            activity: {
                name: `!? => 도움말 | ${client.guilds.cache.size}개의 서버`
            }
        });
    }, 10000);

    try {
        let msgList = await msgSchema.find({});
        if (!msgList) return;
        for (const msg of msgList) {
            try {
                await client.channels.cache.get(msg.chId).messages.fetch(msg.msgId);
            } catch (err) {
                continue;
            }
        }
    } catch (err) {
        return;
    }
};