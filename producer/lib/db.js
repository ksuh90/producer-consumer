const Cloudant = require('@cloudant/cloudant');

const db = Cloudant({
    plugins: 'promises',
    url: process.env.CLOUDANT_URL,
    account: 'admin',
    password: 'pass'
}).db.use('dev');

module.exports = db;
