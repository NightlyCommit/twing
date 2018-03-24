export function merge(map1: Map<any, any>, map2: Map<any, any>) {
    let result = new Map();

    let index = 0;

    for (let [key, value] of map1) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    for (let [key, value] of map2) {
        if (typeof key === 'number') {
            key = index++;
        }

        result.set(key, value);
    }

    return result;
}
