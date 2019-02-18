import {iteratorToHash} from "./iterator-to-hash";
import {isMap} from "./is-map";

const phpJsonEncode = require('locutus/php/json/json_encode');

export function jsonEncode(value: any): string {
    if (isMap(value)) {
        value = iteratorToHash(value);
    }

    return phpJsonEncode(value);
}
