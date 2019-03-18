import {iteratorToArray} from "./iterator-to-array";

export function max(...things: any[]) {
    if (things.length === 1) {
        things = things[0];
    }

    let array = iteratorToArray(things);

    array.sort((a: any, b: any) => {
        return a < b ? 1 : -1;
    });

    return array[0];
}
