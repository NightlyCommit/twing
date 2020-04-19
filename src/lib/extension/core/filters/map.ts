import {iteratorToMap} from "../../../helpers/iterator-to-map";

export async function map(map: any, callback: (...args: Array<any>) => Promise<any>): Promise<Map<any, any>> {
    let result: Map<any, any> = new Map();

    map = iteratorToMap(map);

    for (let [k, v] of map) {
        v = await callback(v);

        result.set(k, v);
    }

    return Promise.resolve(result);
}
