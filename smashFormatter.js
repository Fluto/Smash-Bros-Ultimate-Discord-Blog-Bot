const Discord = require("discord.js");
const striptags = require('striptags');
const _ = require("lodash");

const TITLE_REGEX = /[0-9]{3}\s?\-?\s?/;
const GRAB_URL = /<a href=\"(.*)\">/;
const SMASH_URL = "https://www.smashbros.com";

function formatChunk(chunk) {
    if (chunk == null)
        return null;

    const message = new Discord.RichEmbed()

    message.setFooter("Direct from Papa Sakurai", "https://pa1.narvii.com/6382/f6bcbc7b677b6867f08216c9b3ac3ef6cc3bec5f_128.gif")
    message.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Smash_Ball.png/200px-Smash_Ball.png");

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
    if (chunk.acf.editor != null && chunk.acf.editor.trim() != "") {
        rawDesc = chunk.acf.editor;
        var desc = chunk.acf.editor;
        desc = striptags(desc);
        desc = _.replace(desc, "\n", " ");
        desc = _.replace(desc, title, "");
        if (desc != null && desc.trim() != "")
            message.setDescription(desc);
    }

    // link
    if (chunk.acf.link_url != null && chunk.acf.link_url.trim() != "") {
        message.setURL(chunk.acf.link_url);
    } else {
        var matches = GRAB_URL.exec(rawDesc);
        if (matches != null && matches.length > 0)
            message.setURL(SMASH_URL + matches[matches.length - 1]);
    }

    // image
    if (chunk.acf.image1 != null && chunk.acf.image1.url != null && chunk.acf.image1.url.trim() != "") {
        message.setImage(parseImageURL(chunk.acf.image1.url));
    }
    return message;
}

function parseImageURL(uri) {
    return _.replace(uri, "/413752", SMASH_URL);
}

module.exports = {
    formatChunk: formatChunk
}