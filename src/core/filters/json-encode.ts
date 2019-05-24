import {iteratorToHash} from "../../helper/iterator-to-hash";
import {isMap} from "../../helper/is-map";

const phpJsonEncode = require('locutus/php/json/json_encode');

export function twingFilterJsonEncode(value: any): string {
    if (isMap(value)) {
        value = iteratorToHash(value);
    }

    return phpJsonEncode(value);
}
