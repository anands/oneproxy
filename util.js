// Dependencies:
var fs = require('fs');

// Return buffer array from stream:
function getBufferChunks(stream, callback) {
    var chunks = [];
    stream.on('data', function(chunk) {
        chunks.push(chunk);
    });
    stream.on('end', function() {
        callback(chunks);
    });
}

// Similar to: http://underscorejs.org/#pick
function pick(object, keys) {
    var i, key, len, result;
    result = {};
    for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        result[key] = object[key];
    }
    return result;
}

// Match if there is any intercept for the url:
function matchIntercept(interceptors, url) {
    for (var i = 0; i < interceptors.length; i++) {
        if (interceptors[i].url === url) {
            return interceptors[i];
        }
    }
}

// Read file API:
function readFile(file) {

    function readFilePromise(resolve, reject) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }

    return new Promise(readFilePromise);
}

// Export:
module.exports = {
    'getBufferChunks': getBufferChunks,
    'pick': pick,
    'matchIntercept': matchIntercept,
    'readFile': readFile
}
