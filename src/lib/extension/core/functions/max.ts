import {iteratorToArray} from "../../../helpers/iterator-to-array";

export function max(...values: any[]): Promise<any> {
    if (values.length === 1) {
        values = values[0];
    }

    let array = iteratorToArray(values);

    array.sort((a: any, b: any) => {
        return a < b ? 1 : -1;
    });

    return Promise.resolve(array[0]);
}
