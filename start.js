const discord = require('discord.js');
const helper = require('./helper.js');
const discordBot = require('./discordBot.js');


const client = new discord.Client();

client.login(helper.CLIENT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    discordBot.setup(client);
});

client.on('message', msg => {
    if (msg.content === '!SmashSetup') {
        discordBot.addChannel(msg.channel.id);
        client.channels.get(msg.channel.id).send('Done');
    }
});