export function isCountable(thing: any) {
    return Reflect.has(thing, 'size');
}

export default isCountable;