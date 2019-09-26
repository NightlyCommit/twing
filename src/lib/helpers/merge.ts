import {iteratorToMap} from "./iterator-to-map";

export function merge(iterable1: Map<any, any>, iterable2: Map<any, any>): Map<any, any> {
    let result = new Map();

    let index = 0;

    iterable2 = iterable2 ? iteratorToMap(iterable2) : null;

    if (iterable1 === null || iterable2 === null) {
        return null;
    }

    for (let [key, value] of iterable1) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    for (let [key, value] of iterable2) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    return result;
}
