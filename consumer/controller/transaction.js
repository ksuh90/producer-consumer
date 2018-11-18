const transactionModel = require('../model/transaction');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

/**
 * Get a new transaction id by keeping track of an incremental number
 */
const getNewTransId = async function() {
    const uidKey = 'transaction:id';
    let uid = await getAsync(uidKey);
    const newId = uid ? parseInt(uid) + 1 : 1;
    await setAsync(uidKey, newId);
    return newId;
}

const handler = async function(transObject) {
    let transaction = new transactionModel(
        transObject.producerId,
        transObject.type,
        transObject.userid,
        transObject.amount,
        await getNewTransId()
    );

    console.log(transaction.asJSON());
}

module.exports = handler;
