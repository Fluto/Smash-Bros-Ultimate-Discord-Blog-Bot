const Discord = require('discord.js');
const Helper = require('./helper.js');
const Smash = require('./smashParser.js');
const SmashFormatter = require('./smashFormatter.js');
const client = new Discord.Client();

var channelID;

client.login(Helper.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!setup') {
        channelID = msg.channel.id;
        Smash.setup(client, channelID);
        client.channels.get(channelID).send("dune");
    }
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        var newMessage = SmashFormatter.formatChunk(a);
        console.log(newMessage)
        if (newMessage != null)
            msg.channel.send({ embed: newMessage });
    }
});

var a = {
    "id": 4466,
    "date": "2018/07/18 09:55:03",
    "date_gmt": "2018/07/18 00:55:03",
    "modified": "2018/07/18 10:01:35",
    "modified_gmt": "2018/07/18 01:01:35",
    "type": "english_europe",
    "title": {
        "rendered": "070-Today's Music You can now listen to \"Snake Eater\"."
    },
    "acf": {
        "editor": "<p>Today's Music<br />\nYou can now listen to \"Snake Eater\". The original version was the opening theme song for Metal Gear Solid 3. This time it's an arrangement by Nobuko Toda!<a href=\"/en_GB/sound/index.html\">Music</a></p>\n",
        "chk_link": "none",
        "link_url": "",
        "popup_width": "",
        "popup_height": "",
        "image1": {
            "id": null,
            "alt": null,
            "url": null
        },
        "image2": {
            "id": null,
            "alt": null,
            "url": null
        },
        "image3": {
            "id": null,
            "alt": null,
            "url": null
        },
        "image4": {
            "id": null,
            "alt": null,
            "url": null
        },
        "gif": {
            "id": null,
            "alt": null,
            "url": null
        },
        "video": {
            "id": null,
            "alt": null,
            "url": null
        }
    },
    "_embedded": {
        "author": [{
            "id": "",
            "name": "",
            "description": "",
            "avatar_urls": ""
        }, {
            "id": "",
            "name": "",
            "description": "",
            "avatar_urls": ""
        }, {
            "id": "",
            "name": "",
            "description": "",
            "avatar_urls": ""
        }],
        "wp:featuredmedia": [],
        "wp:term": [
            [{
                "id": 351,
                "name": "Metal Gear Solid Series",
                "slug": "cat01_game-series_16",
                "taxonomy": "english_europe_cat"
            }, {
                "id": 442,
                "name": "Music",
                "slug": "cat06_sound",
                "taxonomy": "english_europe_cat"
            }],
            []
        ]
    },
    "prev": 4451,
    "next": 4486
};