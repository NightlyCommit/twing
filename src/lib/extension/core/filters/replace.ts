import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToHash} from "../../../helpers/iterator-to-hash";
import {TwingErrorRuntime} from "../../../error/runtime";

const strtr = require('locutus/php/strings/strtr');

/**
 * Replaces strings within a string.
 *
 * @param {string} str  String to replace in
 * @param {Array<string>|Map<string, string>} from Replace values
 *
 * @returns {string}
 */
export function twingFilterReplace(str: string, from: any) {
    if (isTraversable(from)) {
        from = iteratorToHash(from);
    } else if (typeof from !== 'object') {
        throw new TwingErrorRuntime(`The "replace" filter expects an hash or "Iterable" as replace values, got "${typeof from}".`);
    }

    return strtr(str, from);
}
