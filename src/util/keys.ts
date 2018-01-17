import ensureTraversable from '../util/ensure-iterable';

export default function twingKeys(value: any) {
    let traversable = ensureTraversable(value);

    return [...traversable.keys()];
}