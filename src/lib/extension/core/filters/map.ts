import {iteratorToMap} from "../../../helpers/iterator-to-map";

export function map(map: any, callback: Function): Promise<Map<any, any>> {
    let result: Map<any, any> = new Map();

    map = iteratorToMap(map);

    for (let [k, v] of map) {
        v = callback(v);

        result.set(k, v);
    }

    return Promise.resolve(result);
}
