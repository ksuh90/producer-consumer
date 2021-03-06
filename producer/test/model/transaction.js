const chai = require('chai');
const assert = chai.assert;
const transModel = require('../../model/transaction');

describe('model/transaction', function() {
    let model = new transModel(
        '2018-11-20T21:18:00.00Z',
        '123abc',
        'payment',
        'foo',
        100.50,
        '111'
    );

    it ('should create a transaction model', function() {
        assert.equal(model.timestamp, '2018-11-20T21:18:00.00Z');
        assert.equal(model.producerId, '123abc');
        assert.equal(model.type, 'payment');
        assert.equal(model.userid, 'foo');
        assert.equal(model.amount, 100.50);
        assert.equal(model.id, '111');
        assert.deepEqual(model.asJSON(), {
            doc_type: 'transaction',
            timestamp: '2018-11-20T21:18:00.00Z',
            producer_id: '123abc',
            type: 'payment',
            userid: 'foo',
            amount: 100.50,
            id: '111'
        });
    });

    it(`should set id to 'bar'`, function() {
        model.id = 'bar';
        assert.equal(model.id, 'bar');
    });
});
