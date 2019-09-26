/**
 * In Twig, a hash is considered a pure array, i.e. a non-keyed array, if its keys form a (xn = n) sequence -i.e. 0,1,2,3,4...
 *
 * @param map
 */
export function isPureArray(map: Map<any, any>): boolean {
    let result: boolean = true;

    let keys: any[] = Array.from(map.keys());
    let i: number = 0;

    while (result && (i < keys.length)) {
        let key: any = keys[i];

        result = (Number(key) === i);

        i++;
    }

    return result;
}
