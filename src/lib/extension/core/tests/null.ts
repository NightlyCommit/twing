export function nullTest(value: any): Promise<boolean> {
    return Promise.resolve(value === null);
}
