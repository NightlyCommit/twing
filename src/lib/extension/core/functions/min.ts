import {iteratorToArray} from "../../../helpers/iterator-to-array";

export function min(...values: Array<any>) {
    if (values.length === 1) {
        values = values[0];
    }

    let array = iteratorToArray(values);

    array.sort();

    return array[0];
}
