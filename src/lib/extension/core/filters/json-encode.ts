import {iteratorToHash} from "../../../helpers/iterator-to-hash";
import {isMap} from "../../../helpers/is-map";
import {isPureArray} from "../../../helpers/is-pure-array";
import {iteratorToArray} from "../../../helpers/iterator-to-array";

const locutusJsonEncode = require('locutus/php/json/json_encode');

export function jsonEncode(value: any): Promise<string> {
    if (isMap(value)) {
        if (isPureArray(value)) {
            value = iteratorToArray(value);
        } else {
            value = iteratorToHash(value);
        }
    }

    return Promise.resolve(locutusJsonEncode(value));
}
