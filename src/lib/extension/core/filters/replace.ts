import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToHash} from "../../../helpers/iterator-to-hash";
import {TwingErrorRuntime} from "../../../error/runtime";

const strtr = require('locutus/php/strings/strtr');

/**
 * Replaces strings within a string.
 *
 * @param {string} str String to replace in
 * @param {Array<string>|Map<string, string>} from Replace values
 *
 * @returns {Promise<string>}
 */
export function replace(str: string, from: any): Promise<string> {
    let _do = (): string => {
        if (isTraversable(from)) {
            from = iteratorToHash(from);
        } else if (typeof from !== 'object') {
            throw new TwingErrorRuntime(`The "replace" filter expects an hash or "Iterable" as replace values, got "${typeof from}".`);
        }

        if (str === undefined) {
            str = '';
        }

        return strtr(str, from);
    };

    try {
        return Promise.resolve(_do());
    } catch (e) {
        return Promise.reject(e);
    }
}
