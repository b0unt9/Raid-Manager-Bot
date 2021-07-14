const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setAuthor('디비전 레이드', `${client.user.displayAvatarURL()}`, '')
        .setTitle(`레이드봇 초대 링크`)
        .setDescription("https://top.gg/bot/781757459307823144")
        .setFooter("문의 : dbots@flarebrick.com / 담당자 : <@365491944400486400> (SYSTEM#6353)")
        .setTimestamp();
    return message.channel.send(embed);
}

exports.config = {
    name: "봇 초대링크",
    aliases: ["초대"]
}