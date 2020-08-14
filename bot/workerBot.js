/**
 * A worker file which will initialise the bot
 * Updates the orderbook every 5 seconds
 * Prints the balance every 30 seconds
 */

import Assets from './services/assets';
import OrderBook from './services/orderBook';

import { logTable } from './helpers/logger';

const ORDER_BOOK_INTERVAL = 5000;
const ASSET_BALANCE_INTERVAL = 30000;

class WorkerBot {
  async initialiseBot() {
    await this.workerFunctions();
    setInterval(this.workerFunctions, ORDER_BOOK_INTERVAL);
    setInterval(() => logTable(Assets.balance, 'AVAILABLE ASSETS'), ASSET_BALANCE_INTERVAL);
  }

  async workerFunctions() {
    await OrderBook.updateOrderBookData();
    await OrderBook.placeOrders();
    await OrderBook.fulfillOrders();
  }
}

export default new WorkerBot();
