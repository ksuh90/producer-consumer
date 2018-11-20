const transactionModel = require('../model/transaction');

/**
 * Describes a controller for transaction
 */
class Transaction {

    constructor(db) {
        this._db = db;
    }

    /**
     * Get the current balance of a user
     * @param  {string} userid
     * @return {number|null}
     */
    async getUserBalance(userid) {
        // hard coding view query for now...
        const resp = await this._db.get('_design/views/_view/balance_by_user?update=true&key="' + userid + '"');
        if (resp.rows.length) {
            return parseFloat(resp.rows[0].value.sum.toFixed(2));
        }
        return null;
    }

    /**
     * Insert a transaction entry to database
     * @param  {object} transObject
     * @return {object} the inserted document with new balance
     */
    async insert(transObject) {
        let transModel = new transactionModel(
            transObject.timestamp,
            transObject.producer_id,
            transObject.type,
            transObject.userid,
            transObject.amount
        );
        let json = transModel.asJSON();
        let rInsert = await this._db.insert(json);
        let rBalance = await this.getUserBalance(transModel.userid);
        json['id'] = rInsert.id;
        json['balance'] = rBalance;
        return json;
    }
}

module.exports = Transaction;
