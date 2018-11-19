const amqp = require('amqplib');
const { randInterval, createTransaction, sleep } = require('./util');

const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    
    while (1) {
        const n = randInterval(1, 6);
        const payload = createTransaction();
        
        await channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(JSON.stringify(payload)));
        //console.log(' [x] Interval %s seconds', n.toString());
        //console.log(payload);
        await sleep(n * 1000);
    }

    channel.close();
}

module.exports = { produce: produce };
