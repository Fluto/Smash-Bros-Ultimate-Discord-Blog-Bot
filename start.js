const discord = require('discord.js');
const helper = require('./helper.js');
const smash = require('./smashParser.js');
const smashFormatter = require('./smashFormatter.js');
const _ = require("lodash");


const client = new discord.Client();

var channelId;
client.login(helper.CLIENT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!setup') {
        channelId = msg.channel.id;
        smash.setup(client, channelId);
        client.channels.get(channelId).send("done");
    }
});