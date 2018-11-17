const amqp = require('amqplib');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);


const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getNewTransId = async function() {
    const uidKey = 'transaction:id';
    let uid = await getAsync(uidKey);
    const newId = uid ? parseInt(uid) + 1 : 1;
    await setAsync(uidKey, newId);
    return newId;
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
        let newId = await getNewTransId();
        console.log(newId);
        //winston.info(`${task.message} received!`);
    });
}

consume();
