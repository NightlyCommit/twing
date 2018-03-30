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
import {compareToArray as compareToArray} from './compare-to-array';
import {compareToString as compareToString} from './compare-to-string';
import {compareToNumber as compareToNumber} from './compare-to-number';
import {compareToBoolean as compareToBoolean} from './compare-to-boolean';
import {compareToDateTime as compareToDateTime} from './compare-to-date-time';
import {compareToNull as compareToNull} from './compare-to-null';

export function compare(firstOperand: any, secondOperand: any): boolean {
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
    if (firstOperand instanceof DateTime) {
        return compareToDateTime(firstOperand, secondOperand);
    }

    // null
    if (firstOperand === null) {
        return compareToNull(secondOperand);
    }

    // fallback to strict comparison
    return firstOperand === secondOperand;
}
