import {iteratorToMap} from "./iterator-to-map";

const locutusRange = require('locutus/php/array/range');

export function createRange<V>(low: V, high: V, step: number): Map<number, V> {
    let range: V[] = locutusRange(low, high, step);

    return iteratorToMap(range);
}
