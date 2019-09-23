import {isTraversable} from "./is-traversable";
import isPlainObject = require("is-plain-object");

export function ensureTraversable(seq: any): any {
    if (isTraversable(seq) || isPlainObject(seq)) {
        return seq;
    }

    return [];
}
