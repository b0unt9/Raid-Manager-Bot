const Discord = require('discord.js');
const errorHandle = require("../utils/errorHandle");

exports.run = async (client, message, args) => {
    try {
        let embed = new Discord.MessageEmbed();
        embed.setTitle('디비전 레이드 초대 주소')
            .setAuthor(`${client.user.name}`, `${client.user.displayAvatarURL()}`, '')
            .addField('봇 초대', 'https://top.gg/bot/781757459307823144')
            .addField('Github Repo', 'https://github.com/sidetoy/The-Division-2-Raid-Manager-Bot')
            .setFooter('개발 : SideToy / 운영 : FlareBrick / 문의 : dbots@flarebrick.com')

    } catch (err) {
        let errMsg = await errorHandle(err);
        return message.channel.send(errMsg);
    }
};

exports.config = {
    name: "봇 초대",
    commands: ["초대", "invite"]
};