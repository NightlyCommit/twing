export function join(map: Map<any, any>, separator: string) {
    return [...map.values()].join(separator);
}
