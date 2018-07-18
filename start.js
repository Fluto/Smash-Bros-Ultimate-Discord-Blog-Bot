const Discord = require('discord.js');
const Helper = require('./helper.js');
const client = new Discord.Client();


client.login(Helper.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});