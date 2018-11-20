const amqp = require('amqplib');
const db = require('./lib/db');
const { randInterval, createTransaction, sleep, users } = require('./lib/util');
const logger = require('./lib/trans-logger');

const createChannel = async function(connection) {
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    return channel;
}

const produce = async function() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    let channel = await createChannel(connection);
    while (1) {
        const config = await db.get('config');
        if (config.mode) {
            // producer ON
            if (!channel) {
                channel = await createChannel(connection);
            }
            const payload = createTransaction();
            const jsonStr = JSON.stringify(payload);
            await db.insert(payload);
            await channel.sendToQueue(
                process.env.QUEUE_NAME,
                Buffer.from(jsonStr)
            );
            logger.info(jsonStr);
            await sleep(randInterval(1, 6) * 1000);
        } else {
            // producer OFF
            if (channel) {
                channel.close();
                console.log('[User balances]');
                for (u in users) {
                    // hard coding view url for now...
                    const resp = await db.get('_design/views/_view/balance_by_user?key="' + users[u] + '"');
                    if (resp.rows.length){
                        console.log('%s: %s', users[u], resp.rows[0].value.sum.toFixed(2));
                    }
                }
            }
            channel = null;
        }
    }
}

produce();
