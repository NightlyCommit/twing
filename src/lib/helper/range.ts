const locutusRange = require('locutus/php/array/range');

export function range(low: any, high: any, step: number): Map<number, any> {
    return locutusRange(low, high, step);
}
