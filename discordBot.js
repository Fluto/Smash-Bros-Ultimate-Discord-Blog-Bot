const _ = require("lodash");
const smashP = require('./smashParser.js');
const smashF = require('./smashFormatter.js');
const request = require('request');
const helper = require("./helper");
const jsonfile = require('jsonfile')
const mkdirp = require('mkdirp');

var client;
var channels = [];
var storedSmash;

function setup(_client) {
    client = _client;

    loadChannels();
    startSmash();
}

function startSmash(){
    jsonfile.readFile(helper.JSON_LOCATION + helper.JSON_SMASH_FILE_NAME, function(err, obj) {
        if (!err) {
            storedSmash = obj;
        }

        fetchJSONLoop();
    });
}

function addChannel(channelId) {
    if (!_.includes(channels, channelId)){
        channels.push(channelId);
        saveChannels();
        console.log("Adding new channel: " + channelId);
    }
}

function removeChannel(channelId) {
    if (_.includes(channels, channelId)){
        _.remove(channels, id => (id === channelId));
        saveChannels();
        console.log("Removed channel: " + channelId);
    }
}

function saveChannels(){
    createTempFolder(() => {
        jsonfile.writeFile(helper.JSON_LOCATION + helper.JSON_CHANNELS_FILE_NAME, {channels: channels}, function(err) {
            if (err) {
                console.log("Cannot create file " + helper.JSON_LOCATION + helper.JSON_CHANNELS_FILE_NAME)
                console.log(err);
            }
        });
    });    
}

function loadChannels(){
    jsonfile.readFile(helper.JSON_LOCATION + helper.JSON_CHANNELS_FILE_NAME, function(err, data) {
        if (!err && data != null && data.channels != null)
            channels = data.channels;
    });    
}

function createTempFolder(pass, fail){
    mkdirp(helper.JSON_LOCATION, function(err) {
        if (err) {
            console.log("Cannot create folder " + helper.JSON_LOCATION);
            console.log(error);
            if (fail != null){
                fail();
                return;
            }
            process.exit(0);
        } else {
            if (pass != null)
                pass();
        }
    });
}

function latest(channelId) {
    // if this is null the bot probably hasn't recieved a JSON yet
    if (storedSmash == null)
    {
        // hope this works
        fetchJSON();
        return;
    }

    // first call fetchJSON to make sure we don't double up with the callback above
    const testId = storedSmash[0].id
    fetchJSON((newSmash) =>{
        // The bot already posted this
        if (newSmash[0].id !== testId)
            return;

        var messages = smashF.formatChunk(newSmash[0]);
        _.forEach(messages, (msg) => client.channels.get(channelId).send(msg));
    });
}



function fetchJSONLoop() {
    fetchJSON();
    setTimeout(fetchJSONLoop, helper.POLL_TIME);
}

function fetchJSON(newSmashCallback) {
    request({
        url: helper.SMASH_JSON_URL,
        json: true
    }, function(error, response, newSmash) {
        if (!error && response.statusCode === 200) {
            if (storedSmash != null && newSmash[0].id == storedSmash[0].id)
                return;

            createTempFolder(() => {
                // store file
                jsonfile.writeFile(helper.JSON_LOCATION + helper.JSON_SMASH_FILE_NAME, newSmash, function(err) {
                    if (err) {
                        console.log("Cannot create file " + helper.JSON_LOCATION + helper.JSON_SMASH_FILE_NAME)
                        console.log(err);
                    } else {
                        if (!storedSmash) {
                            storedSmash = newSmash;
                            return;
                        }
                        
                        if (newSmashCallback)
                            newSmashCallback(newSmash);

                        var messageData = smashP.processChanges(storedSmash, newSmash);
                        
                        storedSmash = newSmash;                            
                        if  (messageData == null || messageData.length == 0)
                            return;
                        
                        console.log("New Data, sending to " + channels.length + " channels");
                        sendMessages(messageData);
                    }
                });
            });
        } else {
            console.log("Couldn't retrieve the Smash JSON");
        }
    });
}

function sendMessages(messageData){
    // for each discord channel
    _.forEach(channels, function(channelId){
        // for each smash chunk
        _.forEach(messageData, function(chunk){
            // for each message in that chunk
            _.forEach(chunk, function(msg) {
                client.channels.get(channelId).send(msg);
            });
        });
    });
    
}

module.exports = {
    setup: setup,
    addChannel: addChannel,
    removeChannel: removeChannel,
    latest: latest
}