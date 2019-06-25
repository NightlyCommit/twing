/**
 * Check whether a string consists of whitespace character(s) only.
 *
 * @param {string} value
 * @return boolean
 */
export function ctypeSpace(value: string): boolean {
    let regExp: RegExp = /^[ \r\n\t\f\v]+$/;

    return regExp.test(value);
}
