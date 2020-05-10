import {TwingContext} from "../context";

export function merge<V>(iterable1: TwingContext<any, V> | Map<any, V>, iterable2: TwingContext<any, V> | Map<any, V>): Map<any, V> {
    let result = new Map();

    let index = 0;

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
