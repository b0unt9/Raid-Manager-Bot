const msgSchema = require("../database/msgSchema");
const timeOutRaid = require('../utils/timeOutRaid');
const raidAlert = require('../utils/raidAlert');
const package = require('../package.json');

module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    let activities = [
        `${client.guilds.cache.size}개의 서버와 함께하는 중`,
        "/명렁어",
        `V${package.version}`
    ];

    setInterval(async () => {
        const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
        const newActivity = activities[randomIndex];

        await client.user.setPresence({
            activity: {
                name: newActivity
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
                console.error(err);
            }
        }
    } catch (err) {
        return;
    }

    timeOutRaid(client);
    raidAlert(client);
};