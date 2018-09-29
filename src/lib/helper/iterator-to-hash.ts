export function iteratorToHash(value: any) {
    let result: any;

    if (value.entries) {
        result = {};

        for (let entry of value.entries()) {
            result[entry[0]] = entry[1];
        }

        return result;
    }
    else {
        result = value;
    }

    return result;
}
