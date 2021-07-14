const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const moment = require('moment');
const DBL = require("dblapi.js");

const client = new Discord.Client();
client.config = require('./config.json');
client.commands = new Enmap();

const dbl = new DBL(client.config.topgg, client);

dbl.on('posted', () => {
    console.log('Server count posted!');
})
  
dbl.on('error', e => {
    console.log(`Oops! ${e}`);
})

moment.locale('ko');

mongoose.connect(client.config.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error)
});

db.once('open', () => {
    console.log('connected to mongoDB server');
});

fs.readdir("./utils/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let utilsName = file.split(".")[0];
        client[utilsName] = require(`./utils/${file}`);
    });
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        props.config.aliases.forEach(alias => {
            client.commands.set(alias, props);
        });
    });
});

schedule.scheduleJob('*/10 * * * * *', function () {
    let now = moment().subtract("1", "h");
    client.database.deleteMany({
        starttime: {
            "$lt": now
        }
    }).then(function () {
        return;
    });
});

schedule.scheduleJob('* * * * * *', function () {
    let now = moment().milliseconds('0').add("10", "m");
    client.database.find({
        starttime: now
    }, function(error, raids) {
        if (error || !raids) return;
        raids.forEach(function(raid) {
            let raidtypetext;
            if (raid.raidtype === 1) {
                raidtypetext = '칠흑';
            } else if (raid.raidtype === 2) {
                raidtypetext = '철마';
            } else if (raid.raidtype === 3) {
                raidtypetext = '칠흑&철마';
            };
            let guildname = client.guilds.cache.get(raid.serverid).name;
            raid.raidmember.forEach(function(member) {
                try {
                    client.users.cache.get(member).send(`**${guildname}**에서 ${raidtypetext} 레이드가 10분 뒤 시작합니다. <@${member}>`)
                } catch (error) {
                    client.channels.cache.get(raid.channelid).send(`${raidtypetext} 레이드가 10분 뒤 시작합니다. <@${member}>`)
                }
            })
        })
    })
});

client.login(client.config.token);