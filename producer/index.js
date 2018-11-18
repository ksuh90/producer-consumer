const amqp = require('amqplib');
const os = require('os');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);

/**
 * Generate a random amount between two integers
 * @param  {int} min
 * @param  {int} max
 * @return {float}
 */
const randAmount = function(min, max) {
    return ((Math.random() * (max - min)) + min).toFixed(2);
}

/**
 * Generate random interval
 * @param  {int} min seconds
 * @param  {int} max seconds
 * @return {int} seconds
 */
const randInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Create a random transaction
 * @return {object}
 */
const createTransaction = function() {
    const types = ['payment', 'topup'];
    const users = [1, 2, 3];
    const amount = randAmount(1, 5001);

    return {
        producerId: os.hostname(),
        userid: users[Math.floor(Math.random() * users.length)],
        type: types[Math.floor(Math.random() * types.length)],
        amount: parseFloat(amount)
    };
}

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * The producer
 */
const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    
    while (1) {
        const n = randInterval(1, 6);
        const payload = createTransaction();
        
        await channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(JSON.stringify(payload)));
        console.log(' [x] Interval %s seconds', n.toString());
        console.log(payload);
        await sleep(n * 1000);
    }

    channel.close();
}

produce();
