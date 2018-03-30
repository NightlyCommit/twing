import {iteratorToArray} from "./iterator-to-array";

export function min(...things: Array<any>) {
    if (things.length === 1) {
        things = things[0];
    }

    let array = iteratorToArray(things);

    array.sort();

    return array[0];
}
