export function divisibleBy(a: any, b: any): Promise<boolean> {
    return Promise.resolve(a % b === 0);
}
