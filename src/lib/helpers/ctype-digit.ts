/**
 * Check whether a string consists of numerical character(s) only.
 *
 * @param {string} value
 * @return boolean
 */
export function ctypeDigit(value: string): boolean {
    let regExp: RegExp = /^\d+$/;

    return regExp.test(value);
}
