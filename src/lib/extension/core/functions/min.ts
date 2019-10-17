import {iteratorToArray} from "../../../helpers/iterator-to-array";

export function min(...values: Array<any>): Promise<any> {
    if (values.length === 1) {
        values = values[0];
    }

    let array = iteratorToArray(values);

    array.sort();

    return Promise.resolve(array[0]);
}
