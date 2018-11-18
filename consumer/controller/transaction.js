const transactionModel = require('../model/transaction');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const hmsetAsync = promisify(redisClient.hmset).bind(redisClient);

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

/**
 * Insert a transaction entry to database
 * @param  {Transaction} trans
 * @return {bool}
 */
const insert = async function(trans) {
    const key = 'transaction:' + trans.id;
    return await hmsetAsync([
        key,
        'transaction_id', trans.id,
        'producer_id', trans.producerId,
        'type', trans.type,
        'userid', trans.userid,
        'amount', trans.amount
    ]);
}

/**
 * Apply transaction to user's account
 * @param  {string} userid
 * @param  {string} type
 * @param  {float} amount
 * @return {bool}
 */
const applyToAccount = async function(userid, type, amount) {
    const key = 'user:' + userid;
    let balance = parseFloat(await hgetAsync(key, 'balance'));
    switch (type) {
        case 'payment':
            balance -= amount;
            break;
        case 'topup':
            balance += amount;
            break;
        default:
            break;
    }

    return await hsetAsync(
        key, 'balance', parseFloat(balance.toFixed(2))
    );
}

const handler = async function(transObject) {
    let trans = new transactionModel(
        transObject.producer_id,
        transObject.type,
        transObject.userid,
        transObject.amount,
        await getNewTransId()
    );

    /*if (await applyToAccount(trans.userid, trans.type, trans.amount)) {
        await insert(trans);
    }*/

    console.log(trans.asJSON());
}

module.exports = handler;
