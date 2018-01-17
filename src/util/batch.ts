import TwingMap from "../map";

import ensureIterable from './ensure-iterable';

/**
 * Batches item.
 *
 * @param {Array} items An array of items
 * @param {number} size  The size of the batch
 * @param fill A value used to fill missing items
 *
 * @returns Array<any>
 */
export default function twingBatch(items: Array<any>, size: number, fill: any = null): Array<TwingMap<any, any>> {
    let map = ensureIterable(items);
    let chunks: Array<TwingMap<any, any>> = map.chunk(size, true);

    if (fill !== null && chunks.length) {
        let last = chunks.length - 1;
        let fillCount = size - chunks[last].size;

        if (fillCount) {
            chunks[last].fill(0, fillCount, fill);
        }
    }

    return chunks;
}