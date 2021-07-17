const guildSchema = require("../database/guildSchema");

module.exports = async (message) => {
    try {
        // let adminData = await guildSchema.findOne({guildId: message.guild.id});
        // if (adminData && adminData.adminRole) {
        //     await adminData.adminRole.forEach((roleId) => {
        //         if (message.member.roles.cache.has(roleId)){
        //             return Boolean(true);
        //         }
        //     });
        // }
        //
        // if (adminData && adminData.adminMember) {
        //     await adminData.adminMember.forEach((memberId) => {
        //         if (message.member.id === memberId) {
        //             return Boolean(true);
        //         }
        //     });
        // }

        if (await message.member.hasPermission('ADMINISTRATOR')) {
            return Boolean(true);
        }

        if (message.member.id === process.env.BOTADMIN) {
            return Boolean(true);
        }

        return Boolean(false);
    } catch (err) {
        throw err;
    }
};