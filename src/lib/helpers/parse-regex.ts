const parser = require('regex-parser');

/**
 * @param {string} input
 * @returns {RegExp}
 */
export function parseRegex(input: string): RegExp {
    return parser(input);
}
