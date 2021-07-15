const msgSchema = require("../database/msgSchema");

module.exports = async (guildId, chId, msgId, raidId) => {
    try {
        let msgData = await msgSchema.findOne({guildId, chId, raidId});
        if (msgData) {
            msgData.msgId = msgId;
            await msgData.save();
        } else {
            let msgModel = new msgSchema();
            msgModel.guildId = guildId;
            msgModel.chId = chId;
            msgModel.msgId = msgId;
            msgModel.raidId = raidId;
            await msgModel.save();
        }
        return null;
    } catch (err) {
        throw err;
    }
};