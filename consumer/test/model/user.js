const chai = require('chai');
const assert = chai.assert;
const userModel = require('../../model/user');

describe('model/user', function() {

    it ('should create a user model', function() {
        let model = new userModel('foo', 100.50);
        assert.equal(model.id, 'foo');
        assert.equal(model.balance, 100.50);
    });

    it('should add 10.55 to balance', function() {
        let model = new userModel('foo', 100.50);
        model.addAmount(10.55);
        assert.equal(model.balance, 111.05);
    });

    it('should subtract 10.20 from balance', function() {
        let model = new userModel('foo', 100.50);
        model.subtractAmount(10.20);
        assert.equal(model.balance, 90.30);
    });
});
