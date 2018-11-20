const server = require('./lib/server');
const eventEmitter = require('events');
const consumer = require('./lib/consumer');

// The event emitter for transaction update for socket.io to listen in.
const ee = new eventEmitter();

// Start consuming
consumer.consume(ee);

// Initialize socket.io
const io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    ee.on('transaction', function (data) {
        socket.emit('transaction', data);
    });
});

server.listen(8080);
