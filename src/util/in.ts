const isNumber = require('is-number');

import isIterable from './is-iterable';
import twingCompare from './compare';

export default function twingIn(value: any, compare: any): boolean {
    let result = false;

    if (Array.isArray(compare)) {
        for (let item of compare) {
            if (twingCompare(item, value)) {
                result = true;
                break;
            }
        }
    }
    else if (typeof compare === 'string' && (typeof value === 'string' || isNumber(value))) {
        result = (value === '' || compare.includes('' + value));
    }
    else if (isIterable(compare)) {
        for (let [key, item] of compare) {
            if (twingCompare(item, value)) {
                result = true;
                break;
            }
        }
    }
    else if (typeof compare === 'object') {
        for (let key in compare) {
            if (twingCompare(compare[key], value)) {
                result = true;
                break;
            }
        }
    }

    return result;
}