const range = require('locutus/php/array/range');

export function twingRange(low: any, high: any, step: number) {
    return range(low, high, step);
}

export default twingRange;
