/**
 * Number format filter.
 *
 * All of the formatting options can be left null, in that case the defaults will
 * be used.  Supplying any of the parameters will override the defaults set in the
 * environment object.
 *
 * @param TwingEnvironment $env
 * @param mixed            $number       A float/int/string of the number to format
 * @param int              $decimal      the number of decimal points to display
 * @param string           $decimalPoint the character(s) to use for the decimal point
 * @param string           $thousandSep  the character(s) to use for the thousands separator
 *
 * @returns string The formatted number
 */
import TwingEnvironment from "../environment";
import {isNullOrUndefined} from "util";

const number_format = require('locutus/php/strings/number_format');

export default function twingFormatNumber(env: TwingEnvironment, number: number, decimal: number, decimalPoint: string, thousandSep: string) {
    let defaults = env.getCoreExtension().getNumberFormat();

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
};