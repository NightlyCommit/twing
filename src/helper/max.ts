import {iteratorToMap} from './iterator-to-map';

export function max(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = iteratorToMap(things).sort(function (a: any, b: any) {
            return a < b ? 1 : 0;
        });

        return iterable.first();
    }

    return Math.max(things);
}
