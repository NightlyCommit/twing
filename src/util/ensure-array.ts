export default function twingEnsureArray(value: any) {
    let result: Array<any>;

    if (Array.isArray(value)) {
        result = value;
    }
    else if (typeof value === 'object') {
        result = [];

        for (let k in value) {
            result.push(value[k]);
        }
    }

    return result;
};