const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const Assets = require('./../../dist/services/assets');

const TEST_ASK_ORDER = {
    price: '390.179029',
    amount: '1.18',
    type: 'ask'
};

const TEST_ASK_ORDER_FAILURE = {
    price: '390.179029',
    amount: '100',
    type: 'ask',
    id: '1234-56789'
};

const TEST_BID_ORDER = {
    price: '391.160161',
    amount: '297.93',
    type: 'bid'
};

const TEST_BID_ORDER_FAILURE = {
    price: '391.160161',
    amount: '50000',
    type: 'bid',
    id: '1234-56789'
};

describe('Initialise Assets', () => {
    it('Initial USD balance', done => {
        Assets.default.balance.should.have.property('USD').eql(2000);
        done();
    });

    it('Initial ETH balance', done => {
        Assets.default.balance.should.have.property('ETH').eql(10);
        done();
    });

    it('Execute BID', done => {
        Assets.default.updateBalance(TEST_BID_ORDER, 'bid');
        Assets.default.balance.should.have.property('ETH').eql(10.76165732020956);
        Assets.default.balance.should.have.property('USD').eql(1702.07);
        done();
    });

    it('Execute ASK', done => {
        Assets.default.updateBalance(TEST_ASK_ORDER, 'ask');
        Assets.default.balance.should.have.property('ETH').eql(9.58165732020956);
        Assets.default.balance.should.have.property('USD').eql(2162.4812542199998);
        done();
    });

    it('Execute BID should fail', done => {
        expect(() => Assets.default.updateBalance(TEST_BID_ORDER_FAILURE, 'bid'))
            .to.throw(`Insufficient USD funds! Cannot fulfill order ${TEST_BID_ORDER_FAILURE.id}`);
        done();
    });

    it('Execute ASK should fail', done => {
        expect(() => Assets.default.updateBalance(TEST_ASK_ORDER_FAILURE, 'ask'))
            .to.throw(`Insufficient ETH funds! Cannot fulfill order ${TEST_ASK_ORDER_FAILURE.id}`);
        done();
    });
});
