import {iteratorToMap} from "../../../helpers/iterator-to-map";

export function filter(map: any, callback: Function): Promise<Map<any, any>> {
    let result: Map<any, any> = new Map();

    map = iteratorToMap(map);

    for (let [k, v] of map) {
        if (callback(v)) {
            result.set(k, v);
        }
    }

    return Promise.resolve(result);
}
