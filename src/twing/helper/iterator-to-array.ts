export function iteratorToArray(value: any, useKeys: boolean = false): Array<any> {
    if (Array.isArray(value)) {
        return value
    }
    else {
        let result: Array<any> = [];

        if (value.entries) {
            for (let entry of value.entries()) {
                result.push(entry[1]);
            }
        }
        else if (typeof value[Symbol.iterator] === 'function') {
            for (let entry of value) {
                result.push(entry);
            }
        }
        else if (typeof value['next'] === 'function') {
            let i: number = 0;
            let next: any;

            while ((next = value.next()) && !next.done) {
                result.push(next.value);
            }
        }
        else {
            for (let k in value) {
                result.push(value[k]);
            }
        }

        return result;
    }
}
