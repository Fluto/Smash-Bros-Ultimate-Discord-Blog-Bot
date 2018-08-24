const _ = require("lodash");
const SmashFormatter = require('./smashFormatter.js');

function processChanges(lastSmashId, newSmash, newestId) {
    const hasNewData = (lastSmashId != newestId);
    
    if (!hasNewData) return [];

    var chunks = getNewChunks(lastSmashId, newSmash, newestId);

    if (chunks == null)
        return [];

    var messageData = [];
    _.forEach(chunks, function(chunk) {
        var data = SmashFormatter.formatChunk(chunk);
        messageData.push(data);
    });

    return messageData
}

function getNewChunks(lastSmashId, newData) {
    var chunks = [];
    
    var chunkID = lastSmashId;
    while (chunkID !== null) {
        chunks.push(newData[chunkID]);

        // conditional breaks so we don't go overboard if something goes wrong
        if (newData[chunkID] == null || newData[chunkID].id == null)
            continue;
        
        chunkID = newData[chunkID].next;
    }

    return chunks;
}

module.exports = {
    processChanges: processChanges
};