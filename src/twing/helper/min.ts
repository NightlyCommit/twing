import {iteratorToMap} from './iterator-to-map';
import {asort} from "./asort";
import {first} from "./first";

export function min(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = iteratorToMap(things);

        asort(iterable);

        return first(iterable);
    }

    return Math.min(things);
}
