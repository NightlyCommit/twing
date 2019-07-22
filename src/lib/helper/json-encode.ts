import {iteratorToHash} from "./iterator-to-hash";
import {isMap} from "./is-map";
import {isPureArray} from "./is-pure-array";
import {iteratorToArray} from "./iterator-to-array";

const phpJsonEncode = require('locutus/php/json/json_encode');

export function jsonEncode(value: any): string {
    if (isMap(value)) {
        if (isPureArray(value)) {
            value = iteratorToArray(value);
        } else {
            value = iteratorToHash(value);
        }
    }

    return phpJsonEncode(value);
}
