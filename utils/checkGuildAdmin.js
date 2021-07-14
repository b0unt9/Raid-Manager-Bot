module.exports = async (message) => {
    try {
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