const guildSchema = require("../database/guildSchema");
const checkGuildAdmin = require("../utils/checkGuildAdmin");
const prefix = JSON.parse(process.env.PREFIX);

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (!prefix.some(pf => message.content.startsWith(pf))) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd);

    if (!command) return;

    // let settings = await guildSchema.findOne({guildId: message.guild.id});
    // if (settings && settings.allowCh.length === 0 && !settings.allowCh.includes(message.channel.id) && !(await checkGuildAdmin(message))) return;

    command.run(client, message, args);
};