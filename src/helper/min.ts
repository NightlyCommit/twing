import {iteratorToMap} from './iterator-to-map';

export function min(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = iteratorToMap(things).sort();

        return iterable.first();
    }

    return Math.min(things);
}
