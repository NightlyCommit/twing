import TwingEnvironment from "../environment";
import TwingErrorRuntime from "../error/runtime";
import convertEncoding from './convert-encoding';
import isIterable from './is-iterable';
import ensureArray from './ensure-array';

const mt_rand = require('locutus/php/math/mt_rand');
const array_rand = require('locutus/php/array/array_rand');

/**
 * Returns a random value depending on the supplied parameter type:
 * - a random item from a Traversable or array
 * - a random character from a string
 * - a random integer between 0 and the integer parameter.
 *
 * @param TwingEnvironment env
 * @param {Traversable|array|int|float|string} values The values to pick a random item from
 *
 * @throws TwingErrorRuntime when values is an empty array (does not apply to an empty string which is returned as is)
 *
 * @return A random value from the given sequence
 */
export default function(env: TwingEnvironment, values: any = null): any {
    if (values === null) {
        return mt_rand();
    }

    if (typeof values === 'number') {
        return values < 0 ? mt_rand(values, 0) : mt_rand(0, values);
    }

    if (isIterable(values)) {
        values = ensureArray(values);
    }
    else if (typeof values === 'string') {
        if (values === '') {
            return '';
        }

        let charset = env.getCharset();

        if (charset !== 'UTF-8') {
            values = convertEncoding(values, charset, 'UTF-8');
        }

        values = values.split('');

        if ('UTF-8' !== 'UTF-8') {
            values = values.map(function(v: string) {
                return convertEncoding(v, 'UTF-8', charset);
            });
        }
    }

    if (!Array.isArray(values)) {
        return values;
    }

    if (values.length < 1) {
        throw new TwingErrorRuntime('The random function cannot pick from an empty array.');
    }

    return values[array_rand(values, 1)];
}