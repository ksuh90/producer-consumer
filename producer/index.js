const amqp = require('amqplib');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const { randInterval, createTransaction, sleep, users } = require('./util');

const createChannel = async function(connection) {
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    return channel;
}

const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    let channel = await createChannel(connection);
    while (1) {
        if (parseInt(await getAsync('producer_mode'))) {
            if (!channel) {
                channel = await createChannel(connection);
            }
            const n = randInterval(1, 6);
            const payload = createTransaction();
            await channel.sendToQueue(
                process.env.QUEUE_NAME,
                Buffer.from(JSON.stringify(payload))
            );
            
            await sleep(n * 1000);
        } else {
            if (channel) {
                channel.close();
                console.log('[User balances]');
                for (u in users) {
                    const balance = await hgetAsync('user:'+users[u], 'balance');
                    console.log('%s: %s', users[u], balance);
                }
            }
            channel = null;
        }
    }
}

produce();
