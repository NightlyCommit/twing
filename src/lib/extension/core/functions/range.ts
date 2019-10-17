import {createRange} from "../../../helpers/create-range";

export function range<V>(low: V, high: V, step: number): Promise<Map<number, V>> {
    return Promise.resolve(createRange(low, high, step));
}
