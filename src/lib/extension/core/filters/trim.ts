import {TwingErrorRuntime} from "../../../error/runtime";

const locutusTrim = require('locutus/php/strings/trim');
const ltrim = require('locutus/php/strings/ltrim');
const rtrim = require('locutus/php/strings/rtrim');

/**
 * Returns a trimmed string.
 *
 * @returns {Promise<string>}
 *
 * @throws TwingErrorRuntime When an invalid trimming side is used (not a string or not 'left', 'right', or 'both')
 */
export function trim(string: string, characterMask: string = null, side: string = 'both'): Promise<string> {
    let _do = (): string => {
        if (characterMask === null) {
            characterMask = " \t\n\r\0\x0B";
        }

        switch (side) {
            case 'both':
                return locutusTrim(string, characterMask);
            case 'left':
                return ltrim(string, characterMask);
            case 'right':
                return rtrim(string, characterMask);
            default:
                throw new TwingErrorRuntime('Trimming side must be "left", "right" or "both".');
        }
    };

    return Promise.resolve(_do());
}
