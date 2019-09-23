import {createRange} from "../../../helpers/create-range";

export function range<V>(low: V, high: V, step: number): Map<number, V> {
    return createRange(low, high, step);
}
