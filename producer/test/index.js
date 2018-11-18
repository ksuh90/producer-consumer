const chai = require('chai');
const assert = chai.assert;
const { randAmount, randInterval, createTransaction } = require('../index');

describe('randAmount', function() {
    it('should be a float', function() {
        const n = randAmount(1, 10);
        assert.isTrue(n % 1 !== 0);
    });

    it('should be between 1(inclusive) and 2(exclusive)', function() {
        const n = randAmount(1, 2);
        assert.isTrue(n >= 1);
        assert.isTrue(n < 2);
    });
});

describe('randInterval', function() {
    it('should be an int', function() {
        const n = randInterval(1, 10);
        assert.isTrue(n % 1 === 0);
    });

    it('should be between 1(inclusive) and 2(exclusive)', function() {
        const n = randAmount(1, 2);
        assert.isTrue(n >= 1);
        assert.isTrue(n < 2);
    });
});

describe('createTransaction', function() {
    const trans = createTransaction();
    it('should have producer_id', function() {
        assert.property(trans, 'producer_id');
    });

    it('should have userid', function() {
        assert.property(trans, 'userid');
    });

    it('should have type', function() {
        assert.property(trans, 'type');
    });

    it('should have amount', function() {
        assert.property(trans, 'amount');
    });

    it('should have amount of type float', function() {
        assert.isTrue(trans.amount % 1 !== 0);
    });
});
