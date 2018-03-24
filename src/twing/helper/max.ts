import {iteratorToMap} from './iterator-to-map';
import {asort} from "./asort";
import {first} from "./first";

export function max(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = iteratorToMap(things);

        asort(iterable, (a: any, b: any) => {
            return a < b ? 1 : 0;
        });

        return first(iterable);
    }

    return Math.max(things);
}
