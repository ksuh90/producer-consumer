const amqp = require('amqplib');
const os = require('os');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);

/**
 * Generate a random integer between two integers
 * @param  {int} min
 * @param  {int} max
 * @return {int}
 */
const rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Create a random transaction
 * @return {object}
 */
const createTransaction = function() {
    const types = ['payment', 'topup'];
    const users = [1, 2, 3];
    const amount = rand(1, 5001);

    return {
        producer_id: os.hostname(),
        userid: users[Math.floor(Math.random() * users.length)],
        type: types[Math.floor(Math.random() * types.length)],
        amount: amount
    };
}

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * The producer
 */
const producer = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();

    var ok = await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    
    while (1) {
        const n = rand(1, 6);
        const payload = createTransaction();
        
        await channel.sendToQueue(process.env.QUEUE_NAME, new Buffer(payload.toString()));
        console.log(' [x] Interval %s seconds', n.toString());
        console.log(payload);
        await sleep(n * 1000);
    }

    channel.close();
}

producer();
