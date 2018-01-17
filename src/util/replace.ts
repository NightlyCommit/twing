/**
 * Replaces strings within a string.
 *
 * @param {string} str  String to replace in
 * @param {Array<string>|Map<string, string>} from Replace values
 *
 * @returns {string}
 */
import TwingErrorRuntime from "../error/runtime";
import ensureHash from '../util/ensure-hash';
import isIterable from '../util/is-iterable';

const strtr = require('locutus/php/strings/strtr');

export default function twingReplace(str: string, from: any) {
    if (isIterable(from)) {
        from = ensureHash(from);
    }
    else if (typeof from !== 'object') {
        throw new TwingErrorRuntime(`The "replace" filter expects an hash or "Iterable" as replace values, got "${typeof from === 'object' ? from.constructor.name : typeof from}".`);
    }

    return strtr(str, from);
}