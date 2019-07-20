import {each} from "./each";

/**
 * Split an hash into chunks.
 *
 * @param {*} hash
 * @param {number} size
 * @param {boolean} preserveKeys
 * @returns {Array<Map<any, any>>}
 */
export function chunk(hash: any, size: number, preserveKeys: boolean = false): Array<Map<any, any>> {
    let result: Array<Map<any, any>> = [];
    let count = 0;
    let currentMap: Map<any, any>;

    each(hash, (key: any, value: any) => {
        if (!currentMap) {
            currentMap = new Map();

            result.push(currentMap);
        }

        currentMap.set(preserveKeys ? key : count, value);

        count++;

        if (count >= size) {
            count = 0;
            currentMap = null;
        }
    });

    return result;
}
