import {TwingEnvironment} from "../../../environment";
import {isNullOrUndefined} from "util";
import {TwingExtensionCore} from "../../../extension/core";

/**
 * Number format filter.
 *
 * All of the formatting options can be left null, in that case the defaults will
 * be used.  Supplying any of the parameters will override the defaults set in the
 * environment object.
 *
 * @param {TwingEnvironment} env
 * @param {*} number A float/int/string of the number to format
 * @param {number} decimal the number of decimal points to display
 * @param {string} decimalPoint the character(s) to use for the decimal point
 * @param {string} thousandSep the character(s) to use for the thousands separator
 *
 * @returns string The formatted number
 */
export function twingFilterNumberFormat(env: TwingEnvironment, number: any, decimal: number, decimalPoint: string, thousandSep: string) {
    const number_format = require('locutus/php/strings/number_format');

    let coreExtension = env.getExtension('TwingExtensionCore') as TwingExtensionCore;
    let defaults = coreExtension.getNumberFormat();

    if (isNullOrUndefined(decimal)) {
        decimal = defaults[0] as number;
    }

    if (isNullOrUndefined(decimalPoint)) {
        decimalPoint = defaults[1] as string;
    }

    if (isNullOrUndefined(thousandSep)) {
        thousandSep = defaults[2] as string;
    }

    return number_format(number, decimal, decimalPoint, thousandSep);
}
