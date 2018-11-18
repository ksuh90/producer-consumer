/**
 * Describes a transaction model
 */
class Transaction {
    constructor(producerId, type, userid, amount, id) {
        this._producerId = producerId;
        this._type = type;
        this._userid = userid;
        this._amount = parseFloat(amount);
        this._id = id || null;
    }

    get producerId() {
        return this._producerId;
    }

    get type() {
        return this._type;
    }

    get userid() {
        return this._userid;
    }

    get amount() {
        return this._amount;
    }

    get id() {
        return this._id;
    }

    set id(id){
        this._id = id;
    }

    asJSON() {
        let ret = {
            producer_id: this._producerId,
            type: this._type,
            userid: this._userid,
            amount: this._amount
        };
        if (this._id) {
            ret['id'] = this._id;
        } 
        return ret;
    }
}

module.exports = Transaction;
