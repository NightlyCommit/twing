import {createRange} from "../../../helpers/create-range";

export function twingFunctionRange<V>(low: V, high: V, step: number): Map<number, V> {
    return createRange(low, high, step);
}
