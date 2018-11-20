const amqp = require('amqplib');
const logger = require('./trans-logger');

const consume = async function(eventEmitter) {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    await channel.prefetch(1);

    channel.consume(process.env.QUEUE_NAME, async (message) => {

        channel.ack(message);

        const data = JSON.parse(message.content.toString());
        logger.info(JSON.stringify(data));
        eventEmitter.emit('transaction', data);
    });
}

module.exports = { consume: consume };
