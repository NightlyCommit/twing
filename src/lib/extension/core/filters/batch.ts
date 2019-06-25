import {isNullOrUndefined} from "util";
import {chunk} from "../../../helpers/chunk";
import {fill as twingFill} from "../../../helpers/fill";

/**
 * Batches item.
 *
 * @param {Array} items An array of items
 * @param {number} size  The size of the batch
 * @param fill A value used to fill missing items
 *
 * @returns Array<any>
 */
export function batch(items: Array<any>, size: number, fill: any = null): Array<Map<any, any>> {
    if (isNullOrUndefined(items)) {
        return [];
    }

    let chunks: Array<Map<any, any>> = chunk(items, size, true);

    if (fill !== null && chunks.length) {
        let last = chunks.length - 1;
        let fillCount = size - chunks[last].size;

        if (fillCount) {
            twingFill(chunks[last], 0, fillCount, fill);
        }
    }

    return chunks;
}
