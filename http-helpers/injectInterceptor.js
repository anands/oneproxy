// Dependencies:
var jsdom = require('jsdom');
var fs = require('fs');
var zlib = require('zlib');
var util = require('../util.js');


// If inject is from file read file and return data, else if from script return script:
function getInjectableData(interceptor) {

    function getInjectableDataPromise(resolve, reject) {
        if (interceptor.file) {
            util.readFile(interceptor.file)
                .then(function(data) {
                    if (interceptor.raw) {
                        resolve(data);
                    } else {
                        resolveUsingScriptTag(data);
                    }
                })
                .catch(reject);
        } else {
            if (interceptor.raw) {
                resolve(interceptor.data);
            } else {
                resolveUsingScriptTag(interceptor.script);
            }
        }

        function resolveUsingScriptTag(script) {
            var scriptTag = '<script>' + script + '</script>';
            resolve(scriptTag);
        }
    }

    return new Promise(getInjectableDataPromise);
}

// Get HTML from the response, used by jsdom do inject data
function getHTML(proxyResponse) {
    var headers = proxyResponse.headers;

    function getHTMLPromise(resolve, reject) {
        util.getBufferChunks(proxyResponse, function(bufferChunks) {
            var html = Buffer.concat(bufferChunks);
            if (headers['content-encoding'] === 'gzip') {
                zlib.gunzip(html, function(err, dezipped) {
                    if (err) {
                        reject('Unable to dezip');
                    } else {
                        html = dezipped.toString('utf-8');
                        resolve(html);
                    }
                });
            } else {

                resolve(html);
            }
        });
    }
    return new Promise(getHTMLPromise);
}

// Inject data into dom
function injectData(html, data) {
    function injectDataPromise(resolve, reject) {
        jsdom.env({
            html: html,
            done: function(err, window) {
                window.document.body.innerHTML += data;
                resolve(jsdom.serializeDocument(window.document));
            }
        });
    }
    return new Promise(injectDataPromise);
}

// Send response to the proxied request
function sendResponse(proxyResponse, response, data) {
    var headers = proxyResponse.headers;
    var keys = Object.keys(headers);
    for (var i = 0; i < keys.length; i++) {
        var ignoreHeaders = ['content-length', 'content-encoding'];
        if (ignoreHeaders.indexOf(keys[i]) === -1) {
            response.setHeader(keys[i], headers[keys[i]]);
        }
    }
    response.writeHead(proxyResponse.statusCode);
    response.end(data);
}

// Export injectInterceptor:
function injectInterceptor(proxyResponse, interceptor, response) {
    getInjectableData(interceptor)
        .then(function(data) {
            getHTML(proxyResponse)
                .then(function(html) {
                    injectData(html, data)
                        .then(function(finalHtml) {

                            sendResponse(proxyResponse, response, finalHtml);
                        })
                })
                .catch(catchError);
        })
        .catch(catchError);

    function catchError(error) {
        console.log(error);
    }
}

module.exports = injectInterceptor;
