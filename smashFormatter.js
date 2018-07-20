const Discord = require("discord.js");
const striptags = require('striptags');
const helper = require("./helper");
var sleep = require('system-sleep');
const _ = require("lodash");
var tinyUrl = require('tinyurl');

const TITLE_REGEX = /[0-9]{3}\s?\-?\s?/;
const GRAB_URL = /<a href=\"(.*)\">/;

function formatChunk(chunk) {
    if (chunk == null)
        return null;

    const message = new Discord.RichEmbed()
    var res = [];

    message.setFooter("Direct from Papa Sakurai", helper.SMASH_BALL_GIF)
    message.setThumbnail(helper.SMASH_BALL_PNG);

    // store the title
    var title = "";
    if (chunk.title != null && chunk.title.rendered != null) {
        title = _.replace(chunk.title.rendered, TITLE_REGEX, "");
        if (title != null && title.trim() != "")
            message.setTitle(title).setColor(0x00AE86);
    }

    // if this is empty, well something probably didn't work
    if (chunk.acf == null)
        return message;

    // description
    var rawDesc = "";
    var desc;
    if (chunk.acf.editor != null && chunk.acf.editor.trim() != "") {
        rawDesc = chunk.acf.editor;
        desc = chunk.acf.editor;
        desc = striptags(desc);
        desc = _.replace(desc, "\n", " ");
        desc = _.replace(desc, title, "");
    }

    // link
    if (chunk.acf.link_url != null && chunk.acf.link_url.trim() != "") {
        var url = chunk.acf.link_url;
        message.setURL(url);
        desc += getUrlLink(url, helper.LINK_EMOJI);

        // if this is a youtube link, make it a seperate post
        if (url.indexOf(helper.YOUTUBE_URL) == 0)
            res.push(getLinkMessage(url));
    } else {
        var matches = GRAB_URL.exec(rawDesc);
        if (matches != null && matches.length > 0) {
            const url = helper.SMASH_URL + matches[matches.length - 1];
            message.setURL(url);
            desc += getUrlLink(url, helper.LINK_EMOJI);
        }
    }

    // image 1
    if (chunk.acf.image1 != null && chunk.acf.image1.url != null && chunk.acf.image1.url.trim() != "") {
        var url = parseImageURL(chunk.acf.image1.url);
        message.setImage(url);
        desc += getUrlLink(url, helper.IMAGE_EMOJI);
    }

    // images
    for (var i = 2; i <= 4; i++) {
        if (chunk.acf["image" + i] != null && chunk.acf["image" + i].url != null && chunk.acf["image" + i].url.trim() != "") {
            var url = parseImageURL(chunk.acf["image" + i].url);
            res.push(getImageMessage(url));
            desc += getUrlLink(url, helper.IMAGE_EMOJI);
        }
    }

    //gif
    if (chunk.acf.gif != null && chunk.acf.gif.url != null && chunk.acf.gif.url.trim() != "") {
        var url = parseImageURL(chunk.acf.gif.url);
        message.setImage(url);
        res.push(getImageMessage(url));
        desc += getUrlLink(url, helper.GIF_EMOJI);
    }

    //video
    if (chunk.acf.video != null && chunk.acf.video.url != null && chunk.acf.video.url.trim() != "") {
        var url = parseImageURL(chunk.acf.video.url);
        message.setImage(url);
        res.push(getLinkMessage(url));
        desc += getUrlLink(url, helper.VID_EMOJI);
    }

    // set the desc
    if (desc != null && desc.trim() != "")
        message.setDescription(desc);

    res.unshift(getEmbedMessage(message));
    return res;
}

function getImageMessage(imageUrl) {
    const message = new Discord.RichEmbed();
    message.setImage(imageUrl);
    return { embed: message }
}

function getEmbedMessage(msg) {
    return { embed: msg }
}

function getLinkMessage(url) {
    return url;
}

function getUrlLink(url, emoji) {
    var emoji = (url.indexOf(helper.YOUTUBE_URL) == 0) ? helper.YOUTUBE_EMOJI : emoji
    return "\n" + emoji + " " + getTinyUrl(url);
}

function parseImageURL(uri) {
    return _.replace(uri, "/413752", helper.SMASH_URL);
}


function getTinyUrl(url) {
    var tiny = "none";
    tinyUrl.shorten(url, function(res) {
        tiny = res;
    });

    var now = Date.now();
    while (tiny === "none") {
        // break if we're waiting too long
        if (Date.now() > tiny + 1000 * 5)
            return "";
        sleep(300); // wait 300ms
    }

    return tiny;
}



module.exports = {
    formatChunk: formatChunk
}