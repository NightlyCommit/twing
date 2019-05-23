import {iteratorToArray} from "../../helper/iterator-to-array";

export function twingFunctionMin(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    let array = iteratorToArray(things);

    array.sort();

    return array[0];
}
