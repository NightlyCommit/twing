/**
 * This one is tricky
 *
 * Equivalence rules is PHP are all over the place.
 * For example an empty array is equivalent to another empty array.
 * Even worse, an empty array is equivalent to false but not to '' but at the same time false and '' are equivalent.
 * This language is a nonsense but we have to conform to its rules.
 *
 * @see http://php.net/manual/en/types.comparisons.php
 * @see https://stackoverflow.com/questions/47969711/php-algorithm-loose-equality-comparison
 */
import {DateTime} from "luxon";
import compareToArray from './compare-to-array';
import compareToString from './compare-to-string';
import compareToNumber from './compare-to-number';
import compareToBoolean from './compare-to-boolean';
import compareToDateTime from './compare-to-date-time';
import compareToNull from './compare-to-null';

export function twingCompare(firstOperand: any, secondOperand: any): boolean {
    // array
    if (Array.isArray(firstOperand)) {
        return compareToArray(firstOperand, secondOperand);
    }

    // string
    if (typeof firstOperand === 'string') {
        return compareToString(firstOperand, secondOperand);
    }

    // number
    if (typeof firstOperand === 'number') {
        return compareToNumber(firstOperand, secondOperand);
    }

    // boolean
    if (typeof firstOperand === 'boolean') {
        return compareToBoolean(firstOperand, secondOperand);
    }

    // date
    // todo: implement date support on other type comparators
    if (firstOperand instanceof DateTime || secondOperand instanceof DateTime) {
        if (firstOperand instanceof DateTime) {
            return compareToDateTime(firstOperand, secondOperand);
        }
        else {
            return compareToDateTime(secondOperand, firstOperand);
        }
    }

    // null
    if (firstOperand === null) {
        return compareToNull(secondOperand);
    }

    // fallback to strict comparison
    return firstOperand === secondOperand;
};

export default twingCompare;