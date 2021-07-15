const msgSchema = require("../database/msgSchema");
const getEmbed = require("../utils/getEmbed");

module.exports = async (client, raidData, diffCode, eventMember) => {
    try {
        msgSchema.find({raidId: raidData.raidId}).then(async (msgList) => {
            let embed = await getEmbed(client, raidData, diffCode, eventMember);
            for (const msg of msgList) {
                await client.channels.cache.get(msg.chId).messages.fetch(msg.msgId).then(async (message) => await message.edit(embed));
            }
        });
    } catch (err) {
        throw err;
    }
};