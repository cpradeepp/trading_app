class Assets {
    constructor() {
        this.balance = {
            ETH: 10,
            USD: 2000
        };
    }

    updateBalance = (order, action) => {
        const { ETH, USD } = this.balance;
        const { id, amount, price } = order;

        try {
            if (action === 'bid') {
                if (USD >= amount) {
                    const quantity = amount / price;
                    const newUSD = USD - amount;
                    const newETH = ETH + quantity;

                    this.balance = {
                        ...this.balance,
                        USD: newUSD,
                        ETH: newETH
                    }
                } else {
                    throw new Error(`Insufficient USD funds! Cannot fulfill order ${id}`);
                }
            } else if(action === 'ask') {
                if(ETH >= amount) {
                    const quantity = amount * price;
                    const newETH = ETH - amount;
                    const newUSD = USD + quantity;

                    this.balance = {
                        ...this.balance,
                        USD: newUSD,
                        ETH: newETH
                    }
                } else {
                    throw new Error(`Insufficient ETH funds! Cannot fulfill order ${id}`);
                }
            }
        } catch(e) {
            console.error(e.message);
            throw new Error(e.message);
        }
    }
}

export default new Assets();
