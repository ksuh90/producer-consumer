/**
 * Describes a user
 */
class User {
    constructor(id, balance) {
        this._id = id;
        this._balance = balance;
    }

    get id() {
        return this._id;
    }

    get balance() {
        return this._balance;
    }

    addAmount(amount) {
        this._balance = this.normalizeBalance(this._balance + amount);
    }

    subtractAmount(amount) {
        this._balance = this.normalizeBalance(this._balance - amount);
    }

    normalizeBalance(n) {
        return parseFloat(n.toFixed(2));
    }
}

module.exports = User;
