var http = require("http");
http.createServer(function(request, response) {
    response.end(`<!DOCTYPE html> <html> <head> <title></title> </head> <body style="border: 1px solid yellow;padding: 0px 10px;"> <p><strong>You requested: ${request.url}</strong></p></body> </html>`)
}).listen(3000);
