import {each} from "./each";

export function chunk(thing: any, size: number, preserveKeys: boolean = false): Array<Map<any, any>> {
    let result: Array<Map<any, any>> = [];
    let count = 0;
    let currentMap: Map<any, any>;

    each(thing, (key: any, value: any) => {
        if (!currentMap) {
            currentMap = new Map();

            result.push(currentMap);
        }

        currentMap.set(key, value);

        count++;

        if (count >= size) {
            count = 0;
            currentMap = null;
        }
    });

    return result;
}
