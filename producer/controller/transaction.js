const transactionModel = require('../model/transaction');
const db = require('../lib/db');

/**
 * Describes a controller for transaction
 */
class Transaction {

    constructor(db) {
        this._db = db;
    }

    async insert(transObject) {
        let transModel = new transactionModel(
            transObject.timestamp,
            transObject.producer_id,
            transObject.type,
            transObject.userid,
            transObject.amount
        );
        let resp = db.inset(transModel.asJSON());
        console.log(resp);
        //return Object.assign({}, this._transModel.asJSON(), {'balance': newBalance});
    }
}

module.exports = Transaction;
