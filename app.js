// Dependencies:
var http = require('http');
var zlib = require('zlib');
var util = require('./util.js');
var httpHelper = require('./http-helpers/');

// Read confie file flag:
if (process.argv[2]) {
    try {
        configFile = process.argv[2].split('--config=')[1];
    } catch (error) {
        configFile = 'config.json';
    }
} else {
    configFile = 'config.json';
}

// Read config:
util
    .readFile(configFile)
    .then(function(config) {
        config = JSON.parse(config);
        run(config.interceptors, config.app);
    })
    .catch(function(error) {
        console.log(error);
        process.exit(1);
    });

// Run App:
function run(interceptors, app) {

    // Create Server:
    var server = http.createServer(requestHandler);
    server.on('listening', function() {
        console.log(`Server running on http://127.0.0.1:${app.SERVER_PORT}`);
    });
    server.on('error', function(error) {
        console.log(error);
        process.exit(1);
    });
    server.listen(app.SERVER_PORT);


    // Request Handler:
    function requestHandler(request, response) {
        var proxyRequest = util.pick(request, ['url', 'method', 'headers']);
        proxyRequest.host = app.PROXY_HOST;
        proxyRequest.port = app.PROXY_PORT;
        proxyRequest.path = proxyRequest.url;
        proxyRequest.headers.host = proxyRequest.host;

        // check if there is any interceptor defined for the path:
        var interceptor = util.matchIntercept(interceptors, proxyRequest.path);
        if (interceptor) {
            if (interceptor.replace) {
                httpHelper.replaceInterceptor(interceptor, response);
                return;
            }
        }

        // Create a proxy request:
        var proxyRequestHandler = http.request(proxyRequest, function(proxyResponse) {
            if (interceptor && interceptor.inject) {
                httpHelper.injectInterceptor(proxyResponse, interceptor, response);
            } else {
                httpHelper.processProxyResponse(proxyResponse, response);
            }
        });

        // If request is POST write the body as well, else trigger the request:
        if (request.method === 'POST') {
            util.getBufferChunks(request, function(body) {
                body = Buffer.concat(body);
                proxyRequestHandler.write(body);
                proxyRequestHandler.end();
            });
        } else {
            proxyRequestHandler.end();
        }
    }
}
