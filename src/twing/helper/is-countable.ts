export function isCountable(thing: any) {
    return Reflect.has(thing, 'size') || Reflect.has(thing, 'length');
}
