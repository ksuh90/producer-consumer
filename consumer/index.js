const server = require('./server');
const amqp = require('amqplib');
const eventEmitter = require('events');
const transController = require('./controller/transaction');

// The event emitter for transaction update for socket.io to listen in.
const ee = new eventEmitter();

/**
 * The consumer
 */
const consume = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    await channel.prefetch(1);

    channel.consume(process.env.QUEUE_NAME, async (message) => {

        // Acknowledge
        channel.ack(message);

        const data = JSON.parse(message.content.toString());
        const controller = new transController(data);
        const transaction = await controller.execute(data);
        console.log(transaction);
        ee.emit('transaction', transaction);
    });
}

consume();

// Initialize socket.io
const io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    ee.on('transaction', function (data) {
        socket.emit('transaction', data);
    });
});

server.listen(8080);
