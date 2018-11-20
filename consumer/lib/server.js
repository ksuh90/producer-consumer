const http = require('http');
const fs = require('fs');
const db = require('./db');

const server = http.createServer(async function (request, response) {
    //console.log('request ', request.url);

    const producerToggleKey = 'producer_mode';

    switch(request.url.substring(1)) {
        case '':
        case 'index.html':
            fs.readFile('./index.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(content, 'utf-8');
            });
            break;
        case 'on':
            console.log('toggle producers ON');
            let resp1 = await db.get('config');
            resp1.mode = 1;
            await db.insert(resp1);
            response.writeHead(200);
            response.end();
            break;
        case 'off':
            console.log('toggle producers OFF');
            let resp2 = await db.get('config');
            resp2.mode = 0;
            await db.insert(resp2);
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


