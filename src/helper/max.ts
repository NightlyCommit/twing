import ensureIterable from './iterator-to-map';

export default function twingMax(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    if (typeof things === 'object') {
        let iterable = ensureIterable(things).sort(function(a: any, b:any) {
            return a < b ? 1 : 0;
        });

        return iterable.first();
    }

    return Math.max(things);
}