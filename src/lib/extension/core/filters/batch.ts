import {isNullOrUndefined} from "util";
import {chunk} from "../../../helpers/chunk";
import {fill as fillHelper} from "../../../helpers/fill";

/**
 * Batches item.
 *
 * @param {any[]} items An array of items
 * @param {number} size  The size of the batch
 * @param {any} fill A value used to fill missing items
 * @param {boolean} preserveKeys
 *
 * @returns Promise<Map<any, any>[]>
 */
export function batch(items: any[], size: number, fill: any = null, preserveKeys: boolean = true): Promise<Map<any, any>[]> {
    if (isNullOrUndefined(items)) {
        return Promise.resolve([]);
    }

    return chunk(items, size, preserveKeys).then((chunks) => {
        if (fill !== null && chunks.length) {
            let last = chunks.length - 1;
            let lastChunk: Map<any, any> = chunks[last];

            fillHelper(lastChunk, size, fill);
        }

        return chunks;
    });
}
