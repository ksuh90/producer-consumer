const os = require('os');

const users = ['tony', 'hulk', 'groot'];

/**
 * Generate a random amount between two integers
 * @param  {int} min
 * @param  {int} max
 * @return {float}
 */
const randAmount = function(min, max) {
    return parseFloat(((Math.random() * (max - min)) + min).toFixed(2));
}

/**
 * Generate random interval
 * @param  {int} min seconds
 * @param  {int} max seconds
 * @return {int} seconds
 */
const randInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a random transaction
 * @return {object}
 */
const createTransaction = function() {
    const types = ['payment', 'topup'];
    const amount = randAmount(1, 1001);

    return {
        doc_type: 'transaction',
        timestamp: (new Date).toISOString(),
        producer_id: os.hostname(),
        userid: users[Math.floor(Math.random() * users.length)],
        type: types[Math.floor(Math.random() * types.length)],
        amount: amount
    };
}

module.exports = {
    randAmount: randAmount,
    randInterval: randInterval,
    sleep: sleep,
    createTransaction: createTransaction,
    users: users
};