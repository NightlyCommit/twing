import {isTraversable} from "./is-traversable";

const isPlainObject = require('is-plain-object');

/**
 * @internal
 */
export function ensureTraversable(seq: any): any {
    if (isTraversable(seq) || isPlainObject(seq)) {
        return seq;
    }

    return [];
}
