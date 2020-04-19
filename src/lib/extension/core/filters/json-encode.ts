import {iteratorToHash} from "../../../helpers/iterator-to-hash";
import {isMap} from "../../../helpers/is-map";
import {isPureArray} from "../../../helpers/is-pure-array";
import {iteratorToArray} from "../../../helpers/iterator-to-array";
import {isPlainObject} from "../../../helpers/is-plain-object";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {isTraversable} from "../../../helpers/is-traversable";

export function jsonEncode(value: any): Promise<string> {
    const _sanitize = (value: any): any=> {
        if (isTraversable(value) || isPlainObject(value)) {
            value = iteratorToMap(value);
        }

        if (isMap(value)) {
            let sanitizedValue: any;

            if (isPureArray(value)) {
                value = iteratorToArray(value);

                sanitizedValue = [];

                for (let key in value) {
                    sanitizedValue.push(_sanitize(value[key]));
                }
            } else {
                value = iteratorToHash(value);

                sanitizedValue = {};

                for (let key in value) {

                    sanitizedValue[key] = _sanitize(value[key]);
                }
            }

            value = sanitizedValue;
        }

        return value;
    };

    return Promise.resolve(JSON.stringify(_sanitize(value)));
}
