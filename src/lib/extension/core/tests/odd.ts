export function odd(value: any): Promise<boolean> {
    return Promise.resolve(value % 2 === 1);
}
