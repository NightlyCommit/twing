import TwingEnvironment from "../environment";

import ensureIterable from './ensure-iterable';
import convertEncoding from './convert-encoding';
import TwingMap from "../map";

/**
 * Reverses a variable.
 *
 * @param {TwingEnvironment} env
 * @param item An array, a Traversable instance, or a string
 * @param {boolean} preserveKeys Whether to preserve key or not
 *
 * @returns The reversed input
 */
export default function twingReverse(env: TwingEnvironment, item: any, preserveKeys: boolean = false): string | TwingMap<any, any> {
    if (typeof item === 'string') {
        let string = '' + item;

        let charset = env.getCharset();

        if (charset !== 'UTF-8') {
            item = convertEncoding(string, charset, 'UTF-8');
        }

        let regExp = /./ug;
        let match: RegExpExecArray;

        string = '';

        while ((match = regExp.exec(item)) !== null) {
            string = match[0] + string;
        }

        if (charset !== 'UTF-8') {
            string = convertEncoding(string, 'UTF-8', charset).toString();
        }

        return string;
    }
    else {
        return ensureIterable(item).reverse(preserveKeys);
    }
}