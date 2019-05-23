import {iteratorToMap} from "./iterator-to-map";

export function merge(iterable1: Array<any> | Map<any, any>, iterable2: Array<any> | Map<any, any>): Array<any> | Map<any, any> {
    let result = new Map();

    let index = 0;

    let map1 = iterable1 ? iteratorToMap(iterable1) : null;
    let map2 = iterable2 ? iteratorToMap(iterable2) : null;

    if (map1 === null || map2 === null) {
        return null;
    }

    for (let [key, value] of map1) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    for (let [key, value] of map2) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    if (Array.isArray(iterable1)) {
        return [...result.values()];
    }

    return result;
}
