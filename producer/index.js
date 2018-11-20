const amqp = require('amqplib');
const db = require('./lib/db');
const { randInterval, createTransaction, sleep, users } = require('./lib/util');
const logger = require('./lib/trans-logger');
const transController = require('./controller/transaction');

const createChannel = async function(connection) {
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    return channel;
}

const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    let channel = await createChannel(connection);
    const controller = new transController(db);

    while (1) {
 
        const config = await db.get('config').catch(() => { return { mode: 0 }});
        
        if (config.mode) {
            // producer ON
            if (!channel) {
                channel = await createChannel(connection);
            }
            await sleep(randInterval(
                parseInt(process.env.INTERVAL_MIN),
                parseInt(process.env.INTERVAL_MAX)
            ) * 1000);
            const payload = createTransaction();
            const resp = await controller.insert(payload);
            const jsonStr = JSON.stringify(resp);
            await channel.sendToQueue(
                process.env.QUEUE_NAME,
                Buffer.from(jsonStr)
            );
            logger.info(jsonStr);
        } else {
            // producer OFF
            if (channel) {
                channel.close();
                console.log('[User balances]');
                for (u in users) {
                    const balance = await controller.getUserBalance(users[u]).catch(() => { return null; });
                    if (balance !== null) {
                        console.log('%s: %s', users[u], balance);
                    }
                }
            }
            channel = null;
        }
    }
}

produce();
