import ensureIterable from './iterator-to-map';

export default function twingMin(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = ensureIterable(things).sort();

        return iterable.first();
    }

    return Math.min(things);
}