export function includes(map: Map<any, any>, thing: any): boolean {
    for (let [key, value] of map) {
        if (value === thing) {
            return true;
        }
    }

    return false;
}
