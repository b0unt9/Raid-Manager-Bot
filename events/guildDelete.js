const msgSchema = require("../database/msgSchema");
const raidSchema = require("../database/raidSchema");

module.exports = async (client, guild) => {
    await msgSchema.deleteMany({guildId: guild.id});
    let raidList = await raidSchema.find({guildId: guild.id});
    for (const raid of raidList) {
        if (raid && raid.guildId.length !== 1) {
            await raid.guildId.splice(raid.guildId.indexOf(guild.id), 1);
            await raid.save();
        } else if (raid && raid.guildId.length === 1) {
            await raidSchema.deleteOne({raidId: raid.raidId});
        }
    }
};