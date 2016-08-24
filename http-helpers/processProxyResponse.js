// Write the proxyResponse to the request response:
function processProxyResponse(proxyResponse, response) {
    var headers = Object.keys(proxyResponse.headers);
    for (var i = 0; i < headers.length; i++) {
        response.setHeader(headers[i], proxyResponse.headers[headers[i]]);
    }
    response.writeHead(proxyResponse.statusCode);
    proxyResponse.on('data', function(chunk) {
        response.write(chunk);
    });
    proxyResponse.on('end', function() {
        response.end();
    });
}

module.exports = processProxyResponse;
