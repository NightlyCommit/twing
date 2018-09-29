export function isMap(candidate: any): boolean {
    return (candidate && (typeof candidate.has === 'function') && (typeof candidate.get === 'function'));
}