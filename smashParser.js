var request = require('request');
const helper = require("./helper");
var jsonfile = require('jsonfile')
var mkdirp = require('mkdirp');
const SmashFormatter = require('./smashFormatter.js');
const _ = require("lodash");

const JSON_LOCATION = "./tmp/";
const JSON_FILE_NAME = "smash.json";
const POLL_TIME = 1000 * 60 * 10; // 10 Minutes

var client;
var channelId;
var storedSmash;

function setup(_client, _channelId) {
    client = _client;
    channelId = _channelId

    jsonfile.readFile(JSON_LOCATION + JSON_FILE_NAME, function(err, obj) {
        if (!err) {
            storedSmash = obj;
            fetchJSONLoop();
        }
    });
}

function fetchJSONLoop() {
    fetchJSON();
    setTimeout(fetchJSONLoop, POLL_TIME);
}

function fetchJSON() {
    request({
        url: helper.SMASH_JSON_URL,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // create folder
            mkdirp(JSON_LOCATION, function(err) {
                if (err) {
                    console.log("Cannot create folder " + JSON_LOCATION);
                    console.log(error);
                    rocess.exit(0);
                } else {
                    // store file
                    jsonfile.writeFile(JSON_LOCATION + JSON_FILE_NAME, body, function(err) {
                        if (err) {
                            console.log("Cannot create file " + JSON_LOCATION + JSON_FILE_NAME)
                            console.log(err);
                        } else {
                            processChanges(body);
                        }
                    });
                }
            });
        }
    });
}

function processChanges(newSmash) {
    // If we haven't loaded a file before, then let's just store it
    if (!storedSmash) {
        storedSmash = newSmash;
        return;
    }

    var latestChunk = newSmash[0].id;
    var latestStoredChunk = storedSmash[0].id;
    const hasNewData = (latestChunk != latestStoredChunk);

    if (!hasNewData) return;

    var chunks = getNewChunks(newSmash, latestStoredChunk);

    if (chunks == null)
        return;

    _.forEach(chunks, function(chunk) {
        var data = SmashFormatter.formatChunk(chunk);
        _.forEach(data, function(msg) {
            client.channels.get(channelId).send(msg);
        });
    });
}

function getNewChunks(newData, lastStoredChunk) {
    var chunks = [];

    var chunkIndex = 0;
    var chunkID = newData[chunkIndex].id;
    while (chunkID !== lastStoredChunk) {
        chunks.push(chunkID = newData[chunkIndex]);
        chunkIndex++;

        if (chunkIndex > newData.length)
            break;

        if (newData[chunkIndex] == null || newData[chunkIndex].id == null)
            continue;

        chunkID = newData[chunkIndex].id;
    }

    return chunks;
}

module.exports = {
    setup: setup
};