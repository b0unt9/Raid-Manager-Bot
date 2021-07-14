const guildSchema = require("../database/guildSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (message.content.indexOf(process.env.PREFIX) !== 0) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd);

    if (!command) return;

    let settings = await guildSchema.findOne({guildId: message.guild.id});
    if (settings && settings.allowCh.length === 0 && !settings.allowCh.includes(message.channel.id) && !(await checkGuildAdmin(message))) return;

    command.run(client, message, args);
};