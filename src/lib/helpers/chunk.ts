import {iterate} from "./iterate";

/**
 * Split an hash into chunks.
 *
 * @param {*} hash
 * @param {number} size
 * @param {boolean} preserveKeys
 * @returns {Promise<Array<Map<any, any>>>}
 */
export async function chunk(hash: any, size: number, preserveKeys: boolean = false): Promise<Array<Map<any, any>>> {
    let result: Array<Map<any, any>> = [];
    let count = 0;
    let currentMap: Map<any, any>;

   await iterate(hash, (key: any, value: any) => {
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

        return Promise.resolve();
    });

    return result;
}
