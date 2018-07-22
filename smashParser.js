const _ = require("lodash");
const SmashFormatter = require('./smashFormatter.js');

function processChanges(storedSmash, newSmash) {
    // If we haven't loaded a file before, then let's just store it
    var latestChunk = newSmash[0].id;
    var latestStoredChunk = storedSmash[0].id;
    
    const hasNewData = (latestChunk != latestStoredChunk);

    console.log("Checking for new data, any? " + hasNewData);
    if (!hasNewData) return [];

    var chunks = getNewChunks(newSmash, latestStoredChunk);

    if (chunks == null)
        return [];

    var messageData = [];
    _.forEach(chunks, function(chunk) {
        var data = SmashFormatter.formatChunk(chunk);
        messageData.push(data);
    });

    // reverse the messages to make sure they arrive oldest to newest
    return _(messageData).reverse().value()
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

    return chunks;1
}

module.exports = {
    processChanges: processChanges
};