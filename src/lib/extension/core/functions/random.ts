import {TwingEnvironment} from "../../../environment";
import {iconv} from "../../../helpers/iconv";
import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToArray} from "../../../helpers/iterator-to-array";
import {TwingErrorRuntime} from "../../../error/runtime";

const runes = require('runes');
const mt_rand = require('locutus/php/math/mt_rand');
const array_rand = require('locutus/php/array/array_rand');

/**
 * Returns a random value depending on the supplied parameter type:
 * - a random item from a Traversable or array
 * - a random character from a string
 * - a random integer between 0 and the integer parameter.
 *
 * @param {TwingEnvironment} env
 * @param {*} values The values to pick a random item from
 *
 * @throws TwingErrorRuntime when values is an empty array (does not apply to an empty string which is returned as is)
 *
 * @returns {*} A random value from the given sequence
 */
export function twingFunctionRandom(env: TwingEnvironment, values: any = null): any {
    if (values === null) {
        return mt_rand();
    }

    if (typeof values === 'number') {
        return values < 0 ? mt_rand(values, 0) : mt_rand(0, values);
    }

    if (typeof values === 'string') {
        values = Buffer.from(values);
    }

    if (Buffer.isBuffer(values)) {
        if (values.toString() === '') {
            return '';
        }

        let charset = env.getCharset();

        if (charset !== 'UTF-8') {
            values = iconv(charset, 'UTF-8', values);
        }

        // unicode split
        values = runes(values.toString());

        if (charset !== 'UTF-8') {
            values = values.map(function (value: string) {
                return iconv('UTF-8', charset, Buffer.from(value));
            });
        }
    }
    else if (isTraversable(values)) {
        values = iteratorToArray(values);
    }

    if (!Array.isArray(values)) {
        return values;
    }

    if (values.length < 1) {
        throw new TwingErrorRuntime('The random function cannot pick from an empty array.');
    }

    return values[array_rand(values, 1)];
}
