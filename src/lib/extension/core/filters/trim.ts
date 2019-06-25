import {TwingErrorRuntime} from "../../../error/runtime";

const trim = require('locutus/php/strings/trim');
const ltrim = require('locutus/php/strings/ltrim');
const rtrim = require('locutus/php/strings/rtrim');

/**
 * Returns a trimmed string.
 *
 * @returns {string}
 *
 * @throws TwingErrorRuntime When an invalid trimming side is used (not a string or not 'left', 'right', or 'both')
 */
export function twingFilterTrim(string: string, characterMask: string = null, side: string = 'both') {
    if (characterMask === null) {
        characterMask = " \t\n\r\0\x0B";
    }

    switch (side) {
        case 'both':
            return trim(string, characterMask);
        case 'left':
            return ltrim(string, characterMask);
        case 'right':
            return rtrim(string, characterMask);
        default:
            throw new TwingErrorRuntime('Trimming side must be "left", "right" or "both".');
    }
}
