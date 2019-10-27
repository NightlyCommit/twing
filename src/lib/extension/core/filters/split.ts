import {TwingEnvironment} from "../../../environment";

const explode = require('locutus/php/strings/explode');

/**
 * Splits the string into an array.
 *
 * <pre>
 *  {{ "one,two,three"|split(',') }}
 *  {# returns [one, two, three] #}
 *
 *  {{ "one,two,three,four,five"|split(',', 3) }}
 *  {# returns [one, two, "three,four,five"] #}
 *
 *  {{ "123"|split('') }}
 *  {# returns [1, 2, 3] #}
 *
 *  {{ "aabbcc"|split('', 2) }}
 *  {# returns [aa, bb, cc] #}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {string} value A string
 * @param {string} delimiter The delimiter
 * @param {number} limit The limit
 *
 * @returns {Promise<Array<string>>} The split string as an array
 */
export function split(env: TwingEnvironment, value: string, delimiter: string, limit: number): Promise<Array<string>> {
    let _do = (): Array<string> => {
        if (delimiter) {
            return !limit ? explode(delimiter, value) : explode(delimiter, value, limit);
        }

        if (!limit || limit <= 1) {
            return value.match(/.{1,1}/ug)
        }

        let length = value.length;

        if (length < limit) {
            return [value];
        }

        let r = [];

        for (let i = 0; i < length; i += limit) {
            r.push(value.substr(i, limit));
        }

        return r;
    };

    return Promise.resolve(_do());
}
