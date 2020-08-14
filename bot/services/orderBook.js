/**
 * File that will store the orderbook, best bid and ask, pending and fulfilled orders
 * Everytime when the data is refreshed it updates the best bid and ask and creates 5 random bids and asks
 * Then, fulfills the bids and asks
 */

import Assets from './assets';
import {
  getBidAndAskPrice, getOrderBook, getRandomNumber, getVal, generateUuid,
} from '../helpers/utils';
import {
  logRefreshData, logTable, logOrders, logInfo, logEndOfInfo,
} from '../helpers/logger';

const BID_ASK_ROUND_OFF = 6;
const CURRENCY_ROUND_OFF = 2;
const BID_ASK_OFFSET_PERCENT = 5;
const ASSET_OFFSET_PERCENT = 15;
const ORDER_COUNT = 5;

class OrderBook {
  constructor() {
    this.tradeData = {
      bestBid: 0,
      bestAsk: 0,
      spread: 0,
      pendingOrders: [],
      fulfilledOrders: [],
    };
  }

  /**
     * Function that will make the request to update the orderbook and calculate the best bid and ask
     * @returns {Promise<void>}
     */
  async updateOrderBookData() {
    logRefreshData();
    const rawData = await getOrderBook();

    const [ask, bid] = getBidAndAskPrice(rawData);
    const bestBid = getVal(bid, 1, 'max');
    const bestAsk = getVal(ask, 1, 'min');
    const spread = bestAsk - bestBid;
    this.tradeData = {
      ...this.tradeData,
      bestBid,
      bestAsk,
      spread,
    };
    logTable({ 'New Bid': bestBid, 'New Ask': bestAsk }, 'BEST BID BEST AND ASK');
  }

  /**
     * Function that will place the 5 bid and ask orders at random price and quantity based on the best bid and ask
     * @returns {Promise<void>}
     */
  async placeOrders() {
    logInfo('PLACING ORDERS');
    const {
      bestBid, bestAsk, spread, pendingOrders,
    } = this.tradeData;
    const { balance: { ETH, USD } } = Assets;
    const offset = spread * BID_ASK_OFFSET_PERCENT / 100;
    const minBid = bestBid - offset;
    const maxBid = bestBid + offset;
    const minAsk = bestAsk - offset;
    const maxAsk = bestAsk + offset;
    const bidOrders = pendingOrders.filter((o) => o.type === 'bid');
    const askOrders = pendingOrders.filter((o) => o.type === 'ask');

    for (let i = 0; i < ORDER_COUNT; i++) {
      bidOrders.push(OrderBook.constructOrderArray(USD, minBid, maxBid, 'bid'));
      askOrders.push(OrderBook.constructOrderArray(ETH, minAsk, maxAsk, 'ask'));
    }

    this.updateTradeDataState(bidOrders, askOrders);
    logEndOfInfo('PLACING ORDERS');
  }

  /**
     * Function that will compare the best bid and ask with the pending orders and fulfills them accordingly
     * And updates the balance and tradeData
     * @returns {Promise<void>}
     */
  async fulfillOrders() {
    logInfo('FULFILLING ORDERS');
    const {
      pendingOrders, bestBid, bestAsk, fulfilledOrders,
    } = this.tradeData;
    const bidOrders = pendingOrders.filter((o) => o.type === 'bid');
    const askOrders = pendingOrders.filter((o) => o.type === 'ask');

    let i = bidOrders.length;
    let j = askOrders.length;

    while (i--) {
      const fulfilled = await this.updateBalanceAndLog('bid', bidOrders[i], bestBid);
      if (fulfilled) {
        fulfilledOrders.push({
          ...askOrders.splice(j, 1)[0],
          fulfilled,
        });
      }
    }

    while (j--) {
      const fulfilled = await this.updateBalanceAndLog('ask', askOrders[j], bestAsk);
      if (fulfilled) {
        fulfilledOrders.push({
          ...askOrders.splice(j, 1)[0],
          fulfilled,
        });
      }
    }

    this.updateTradeDataState(bidOrders, askOrders, fulfilledOrders);
    logEndOfInfo('FULFILLING ORDERS');
  }

  /**
     * Function to construct the order object based on the below params
     * @param asset = {USD or ETH}
     * @param min = {Number}
     * @param max = {Number}
     * @param type = {bid or ask}
     * @returns {{amount: *, price: *, created: Date, id, type: *}}
     */
  static async constructOrderArray(asset, min, max, type) {
    const id = generateUuid();
    const assetOffset = asset * ASSET_OFFSET_PERCENT / 100;
    const price = getRandomNumber(min, max, BID_ASK_ROUND_OFF);
    const amount = getRandomNumber(0, assetOffset, CURRENCY_ROUND_OFF);
    const created = new Date();

    logOrders(`${created} PLACING ${type.toUpperCase()}: Amount - ${amount} Price: ${price}`, type);

    return {
      id, price, amount, type, created,
    };
  }

  async updateTradeDataState(bidOrders = [], askOrders = [], fulfilledOrders = []) {
    this.tradeData = {
      ...this.tradeData,
      pendingOrders: [...bidOrders.sort((a, b) => b.price - a.price),
        ...askOrders.sort((a, b) => a.price - b.price)],
      ...fulfilledOrders,
    };
  }

  async updateBalanceAndLog(type, order, bestPrice) {
    const condition = type === 'bid' ? order.price >= bestPrice : order.price <= bestPrice;

    if (condition) {
      try {
        const fulfilled = new Date();
        await Assets.updateBalance(order, type);
        logOrders(`${fulfilled} FULFILL ${type.toUpperCase()}: Amount - ${order.amount} Price: ${order.price}`, type);
        return fulfilled;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}

export default new OrderBook();
