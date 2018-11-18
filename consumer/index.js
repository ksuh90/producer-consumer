const amqp = require('amqplib');
const controller = require('./controller/transaction');

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * The consumer
 */
const consume = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    await channel.prefetch(1);

    channel.consume(process.env.QUEUE_NAME, async (message) => {
        await sleep(1000);

        const content = message.content.toString('utf-8');

        channel.ack(message);

        console.log(content);
        await controller(JSON.parse(content));
        //let newId = await getNewTransId();
        //console.log(newId);
        //winston.info(`${task.message} received!`);
    });
}

consume();
