const http = require('http');

const server = function(eventEmitter) {
    return http.createServer(function (request, response) {
        let mode = request.url.substring(1);
        switch(mode) {
            case 'on':
                eventEmitter.emit('toggle', 1);
                break;
            case 'off':
                eventEmitter.emit('toggle', 0);
                break;
            default:
                break;
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(
            Buffer.from(JSON.stringify({mode: mode}))
        );
    });
}

module.exports = server;
