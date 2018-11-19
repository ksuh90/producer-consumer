const http = require('http');
const fs = require('fs');

const server = http.createServer(function (request, response) {
    //console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './') {
        
    }

    switch(request.url.substring(1)) {
        case '':
        case 'index.html':
            fs.readFile('./index.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(content, 'utf-8');
            });
            break;
        case 'on':
            http.get('http://neat-back_producer_1:8125/on');
            response.writeHead(200);
            response.end();
            break;
        case 'off':
            http.get('http://neat-back_producer_1:8125/off');
            response.writeHead(200);
            response.end();
            break;
        default:
            response.writeHead(500);
            response.end();
            break;
    }
});

module.exports = server;


