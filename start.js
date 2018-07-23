const _ = require("lodash");
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
    if (msg.content.toLowerCase() === helper.BOT_PREFIX + 'addchannel') {
        discordBot.addChannel(msg.channel.id);
        client.channels.get(msg.channel.id).send('Added this channel');
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase() === helper.BOT_PREFIX + 'removechannel') {
        discordBot.removeChannel(msg.channel.id);
        client.channels.get(msg.channel.id).send('Removed this channel');
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase() === helper.BOT_PREFIX + 'latest') {
        discordBot.latest(msg.channel.id);
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase() === helper.BOT_PREFIX + 'help') {
        
        const message = new discord.RichEmbed();
        message.setColor(0xFFAA00);
        _.forEach(commands, (info, command) => message.addField(helper.BOT_PREFIX + command, info));
        client.channels.get(msg.channel.id).send({embed: message});

    }
});

const commands = {
    "addChannel": "This will add this channel on to the smash post list.",
    "removeChannel": "This will remove this channel from the smash post list.",
    "latest": "This will retrieve the latest post.",
    "help": "You're using it now " + helper.THINKING_EMOJI,
}