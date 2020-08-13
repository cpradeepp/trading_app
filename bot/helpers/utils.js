import fetch from 'node-fetch';
import {SETTINGS} from "../config/prod";

/**
 * Function that will make the orderBook API request
 * @param symbol
 * @param precision
 * @returns {Promise<any>}
 */
export const getOrderBook = async (symbol = 'tETHUSD', precision = 'R0') => {
    const url = `${SETTINGS.BASE_URL}book/${symbol}/${precision}`;
    return await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    })
    .then(res => res.json());
};

/**
 * Helper function to separate out the bid and ask array
 * @param data
 * @returns {*}
 */
export const getBidAndAskPrice = data => data.reduce((result, element) => {
        result[element[2] < 0 ? 0 : 1].push(element);
        return result;
    }, [[], []]
);

/**
 * Helper to get the best bid and ask price
 * @param data
 * @param key
 * @param action
 * @returns {*}
 */
export const getVal = (data, key, action) => Math[action].apply(Math, data.map(function(o) { return o[key]; }));

/**
 * Helper to get a random number within the range
 * @param min
 * @param max
 * @param roundOff
 * @returns {*|string}
 */
export const getRandomNumber = (min, max, roundOff) => (Math.random() * (max - min) + min).toFixed(roundOff);

/**
 * Function to generate a uuid
 * @returns {string}
 */
export const generateUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
