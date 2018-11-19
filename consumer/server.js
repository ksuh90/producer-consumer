const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function (request, response) {
    //console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var contentType = 'text/html';

    fs.readFile(filePath, function(error, content) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    });

});

module.exports = server;
