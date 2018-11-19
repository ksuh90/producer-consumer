const amqp = require('amqplib');
const { randInterval, createTransaction, sleep } = require('./util');

const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });

    while (parseInt(process.env.PRODUCER_MODE)) {
        const n = randInterval(1, 6);
        const payload = createTransaction();
        await channel.sendToQueue(
            process.env.QUEUE_NAME,
            Buffer.from(JSON.stringify(payload))
        );
        
        await sleep(n * 1000);
    }

    channel.close();
}

module.exports = { produce: produce };
