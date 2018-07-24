# Smash-Bros-Ultimate-Discord-Blog-Bot
A node.js discord bot to re-post Super Smash Bros. Ultimate blog posts into discord channels.

## Commands
The bot is pretty simple at the moment, you can:
<dl>
  <dt>AddChannel</dt>
  <dd>This adds the channel you type this command on to be added to the repost list.</dd>
  <dt>RemoveChannel</dt>
  <dd>This will remove the channel you type this command on to be removed from the repost list.</dd>
  <dt>Latest</dt>
  <dd>This will retrieve the latest post.</dd>
  <dt>Help</dt>
  <dd>Will display these options in the channel.</dd>
</dl>

## Installation
* Make sure you have npm installed. [You can get it here](https://www.npmjs.com/)
* Download this repo or clone it into a folder of your choice
* Whip open the `helper.js` file and change `<CLIENT_TOKEN>` and `<CLIENT_ID>` to your discord bot's token and id under `CLIENT_TOKEN` and `BOT_INVITE`. Assuming you have already created your bot you can find these details on the [discord dev site](https://discordapp.com/developers/applications)
* Open up your terminal or equivalent, go to the extracted folder and run `npm install`
* Once that's done run the bot with `npm start`
* You can invite the bot to your channel by entering the url under `BOT_INVITE` in the `helper.js` file. (Make sure you replace `<CLIENT_ID>`)

### Optional Stuff
* You can change the command prefix under `helper.js` `BOT_PREFIX`, the default is `!`

