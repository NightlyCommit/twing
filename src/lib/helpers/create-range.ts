const locutusRange = require('locutus/php/array/range');

export function createRange<V>(low: V, high: V, step: number): Map<number, V> {
    return locutusRange(low, high, step);
}
