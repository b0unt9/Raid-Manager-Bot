const msgSchema = require("../database/msgSchema");
const raidSchema = require("../database/raidSchema");
const addMember = require("../utils/addMember");
const removeMember = require("../utils/removeMember");
const getEmbed = require("../utils/getEmbed");
const errorHandle = require("../utils/errorHandle");
const updateInfo = require("../utils/updateInfo");

module.exports = async (client, reaction, user) => {
    if (user.bot) return;
    if (reaction.emoji.name !== "🤚") return;
    try {
        let msgData = await msgSchema.findOne({guildId: reaction.message.guild.id, msgId: reaction.message.id});
        if (!msgData) return;
        let raid = await raidSchema.findOne({raidId: msgData.raidId});
        if (!raid.member.includes(user.id)) {
            let raidData = await addMember(reaction.message.guild.id, raid.raidId, user.id);
            let embed = await getEmbed(client, raidData, 2, user.id);
            reaction.message.edit(embed);
            await updateInfo(client, raidData, 2, user.id);
        } else {
            let raidData = await removeMember(reaction.message.guild.id, raid.raidId, user.id);
            let embed = await getEmbed(client, raidData, 3, user.id);
            reaction.message.edit(embed);
            await updateInfo(client, raidData, 3, user.id);
        }
    } catch (err) {
        let errMsg = await errorHandle(err);
        return reaction.message.channel.send(errMsg);
    }
}