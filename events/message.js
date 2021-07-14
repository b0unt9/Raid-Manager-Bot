module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.guild.me.hasPermission('SEND_MESSAGES') || !message.guild.me.hasPermission('MANAGE_MESSAGES') || !message.guild.me.hasPermission('EMBED_LINKS') || !message.guild.me.hasPermission('ATTACH_FILES') || !message.guild.me.hasPermission('READ_MESSAGE_HISTORY') || !message.guild.me.hasPermission('MENTION_EVERYONE') || !message.guild.me.hasPermission('USE_EXTERNAL_EMOJIS') || !message.guild.me.hasPermission('ADD_REACTIONS')) {
        return message.author.send("해당 채널 혹은 서버에 봇이 필요한 권한이 없어 명령어를 사용할 수 없습니다.\n해당 디스코드 서버의 관리자에게 문의해주세요.")
    }

    if (message.reference) {
        client.database.findOne({
            textid: message.reference.messageID
        }, function(error, raids) {
            let args
            if (error || !raids) return;
            if (message.content.indexOf(process.env.PREFIX) !== 0) {
                args = message.content.trim().split(/ +/g);
            } else {
                args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
            }

            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd);
            if (!command) return;
            args.unshift(raids.raidid);
            command.run(client, message, args);
        });
    } else {
        if (message.content.indexOf(process.env.PREFIX) !== 0) return;
    
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd);

        if (!command) return;
        command.run(client, message, args);
    }
};