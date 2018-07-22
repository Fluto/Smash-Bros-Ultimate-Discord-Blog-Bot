const _ = require("lodash");
const smash = require('./smashParser.js');
const request = require('request');
const helper = require("./helper");
const jsonfile = require('jsonfile')
const mkdirp = require('mkdirp');

var client;
var channels = [];
var storedSmash;

function setup(_client) {
    client = _client;

    jsonfile.readFile(helper.JSON_LOCATION + helper.JSON_FILE_NAME, function(err, obj) {
        if (!err) {
            storedSmash = obj;
        }

        fetchJSONLoop();
    });
}

function addChannel(channelId) {
    if (!_.includes(channels, channelId)){
        channels.push(channelId);
        console.log("Adding new channel: " + channelId);
    }
}

function fetchJSONLoop() {
    fetchJSON();
    setTimeout(fetchJSONLoop, helper.POLL_TIME);
}

function fetchJSON() {
    request({
        url: helper.SMASH_JSON_URL,
        json: true
    }, function(error, response, newSmash) {
        if (!error && response.statusCode === 200) {
            // create folder
            mkdirp(helper.JSON_LOCATION, function(err) {
                if (err) {
                    console.log("Cannot create folder " + helper.JSON_LOCATION);
                    console.log(error);
                    process.exit(0);
                } else {
                    // store file
                    jsonfile.writeFile(helper.JSON_LOCATION + helper.JSON_FILE_NAME, newSmash, function(err) {
                        if (err) {
                            console.log("Cannot create file " + helper.JSON_LOCATION + helper.JSON_FILE_NAME)
                            console.log(err);
                        } else {
                            if (!storedSmash) {
                                storedSmash = newSmash;
                                return;
                            }

                            var messageData = smash.processChanges(storedSmash, newSmash);
                            if  (messageData == null || messageData.length == 0)
                                return;

                            console.log("New Data, sending to " + channels.length + " channels");
                            sendMessages(messageData);
                        }
                    });
                }
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
    addChannel: addChannel
}