require("dotenv").config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const fs = require('fs');

const mongoose = require('mongoose');
const databaseUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?authSource=${process.env.DATABASE_AUTHSOURCE}`

mongoose.connect(databaseUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to MongoDB Server');
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Event Load : ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log(`Command Load : ${file}`);
        props.config.commands.forEach(commandName => {
            client.commands.set(commandName, props);
        });
    });
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

client.login(process.env.TOKEN);