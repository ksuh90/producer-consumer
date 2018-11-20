const userModel = require('../model/user');
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
 * Describes a controller for transaction
 */
class Transaction {
    constructor(transObject) {
        this._transModel = new transactionModel(
            transObject.timestamp,
            transObject.producer_id,
            transObject.type,
            transObject.userid,
            transObject.amount
        );
    }

    /**
     * Get a new transaction id by keeping track of an incremental number
     */
    async getNewTransId() {
        const uidKey = 'transaction:id';
        let uid = await getAsync(uidKey);
        const newId = uid ? parseInt(uid) + 1 : 1;
        await setAsync(uidKey, newId);
        return newId;
    }

    /**
     * Apply transaction to user's account
     * @return {bool}
     */
    async applyToAccount() {
        const key = 'user:' + this._transModel.userid;
        let user = new userModel(
            this._transModel.userid,
            parseFloat(await hgetAsync(key, 'balance'))
        );

        switch (this._transModel.type) {
            case 'payment':
                user.subtractAmount(this._transModel.amount);
                break;
            case 'topup':
                user.addAmount(this._transModel.amount);
                break;
            default:
                break;
        }

        await hsetAsync(key, 'balance', user.balance);
        return user.balance;
    }

    /**
     * Insert a transaction entry to database
     * @return {bool}
     */
    async insert() {
        const key = 'transaction:' + this._transModel.id;
        return await hmsetAsync([
            key,
            'timestamp', this._transModel.timestamp,
            'transaction_id', this._transModel.id,
            'producer_id', this._transModel.producerId,
            'type', this._transModel.type,
            'userid', this._transModel.userid,
            'amount', this._transModel.amount
        ]);
    }

    async execute() {
        this._transModel.id = await this.getNewTransId();
        const newBalance = await this.applyToAccount();
        await this.insert();
        return Object.assign({}, this._transModel.asJSON(), {'balance': newBalance});
    }
}

module.exports = Transaction;
