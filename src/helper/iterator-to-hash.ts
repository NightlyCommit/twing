export default function iteratorToHash(value: any) {
    let result: any;

    if (value.entries) {
        result = {};

        for (let entry of value.entries()) {
            result[entry[0]] = entry[1];
        }

        return result;
    }
    else if (typeof value === 'object') {
        result = value;
    }

    return result;
}