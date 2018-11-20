const http = require('http');
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');
const setAsync = promisify(redisClient.set).bind(redisClient);

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
            await setAsync(producerToggleKey, 1);
            response.writeHead(200);
            response.end();
            break;
        case 'off':
            console.log('toggle producers OFF');
            await setAsync(producerToggleKey, 0);
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


