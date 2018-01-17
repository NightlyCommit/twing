import ensureIterable from './ensure-iterable';

export default function twingEnsureHash(thing: any) {
    let result: any = {};

    thing = ensureIterable(thing);

    for (let [k, v] of thing) {
        result[k] = v;
    }

    return result;
}