export function fill(map: Map<any, any>, start: number, length: number, value: any) {
    for (let i = start; i < length; i++) {
        map.set(i, value);
    }
}
