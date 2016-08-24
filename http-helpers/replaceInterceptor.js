// Dependencies:
var fs = require('fs');

function replaceInterceptor(interceptor, response) {
    if (interceptor.replace && interceptor.data) {
        response.end(interceptor.data);
    } else if (interceptor.replace && interceptor.file) {
        fs.readFile(interceptor.file, 'utf8', function(err, data) {
            if (err) {
                return;
            }
            response.end(data);
        });
    }
}


module.exports = replaceInterceptor;
