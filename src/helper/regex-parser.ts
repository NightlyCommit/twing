const parser = require('regex-parser');

/**
 *
 * @param {string} input
 * @returns {RegExp}
 */
export function regexParser(input: string): RegExp {
    return parser(input);
}

export default regexParser;