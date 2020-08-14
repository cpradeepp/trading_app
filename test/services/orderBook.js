const chai = require('chai');

const should = chai.should();
const { expect } = chai;

const OrderBook = require('../../dist/services/orderBook');
const Assets = require('../../dist/services/assets');

const INITIAL_TRADE_DATA = {
  bestBid: 0,
  bestAsk: 0,
  spread: 0,
  pendingOrders: [],
  fulfilledOrders: [],
};

describe('Initialise Order book', () => {
  const { balance } = Assets.default;
  it('Initial tradeData value', (done) => {
    OrderBook.default.tradeData.should.have.property('bestBid').eql(0);
    OrderBook.default.tradeData.should.have.property('bestAsk').eql(0);
    OrderBook.default.tradeData.should.have.property('spread').eql(0);
    OrderBook.default.tradeData.should.have.property('pendingOrders').to.have.lengthOf(0);
    OrderBook.default.tradeData.should.have.property('fulfilledOrders').to.have.lengthOf(0);
    done();
  });

  it('Update Order book data', (done) => {
    OrderBook.default.updateOrderBookData()
      .then(() => {
        OrderBook.default.tradeData.should.have.property('bestBid').not.eql(0);
        OrderBook.default.tradeData.should.have.property('bestAsk').not.eql(0);
        OrderBook.default.tradeData.should.have.property('spread').not.eql(0);
        done();
      });
  });

  it('Placing Orders', (done) => {
    OrderBook.default.placeOrders()
      .then(() => {
        OrderBook.default.tradeData.should.have.property('pendingOrders').not.to.have.lengthOf(0);
        done();
      });
  });

  it('Fulfilling Orders', (done) => {
    OrderBook.default.fulfillOrders()
      .then(() => {
        OrderBook.default.tradeData.should.have.property('fulfilledOrders').not.to.have.lengthOf(0);
        done();
      });
  });

  it('Fulfilling should have updated balance ETH and USD', (done) => {
    Assets.default.balance.should.have.property('USD').not.eql(balance.USD);
    Assets.default.balance.should.have.property('ETH').not.eql(balance.ETH);
    done();
  });
});
