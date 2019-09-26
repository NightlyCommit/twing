import {compare as compareHelper} from "./compare";
import {isTraversable} from "./is-traversable";
import {iteratorToArray} from "./iterator-to-array";
import {TwingMarkup} from "../markup";
import {isMap} from "./is-map";

export function isIn(value: any, compare: any): boolean {
    let result = false;

    if (value instanceof TwingMarkup) {
        value = value.toString();
    }

    if (compare instanceof TwingMarkup) {
        compare = compare.toString();
    }

    if (isMap(compare)) {
        for (let [key, item] of (compare as Map<number, any>)) {
            if (compareHelper(item, value)) {
                result = true;
                break;
            }
        }
    } else if (typeof compare === 'string' && (typeof value === 'string' || typeof value === 'number')) {
        result = (value === '' || compare.includes('' + value));
    } else if (isTraversable(compare)) {
        for (let item of iteratorToArray(compare)) {
            if (compareHelper(item, value)) {
                result = true;
                break;
            }
        }
    } else if (typeof compare === 'object') {
        for (let key in compare) {
            if (compareHelper(compare[key], value)) {
                result = true;
                break;
            }
        }
    }

    return result;
}
