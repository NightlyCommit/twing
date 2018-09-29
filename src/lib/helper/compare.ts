/**
 * Compare by conforming to PHP loose comparisons rules
 *
 * @see http://php.net/manual/en/types.comparisons.php
 * @see https://stackoverflow.com/questions/47969711/php-algorithm-loose-equality-comparison
 */

import {DateTime} from "luxon";

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

/**
 * Compare an array to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
 * │ []      │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ FALSE |
 * │ ["php"] │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE    │ FALSE │ FALSE |
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
function compareToArray(firstOperand: Array<any>, secondOperand: any): boolean {
    if (firstOperand.length < 1) {
        return (secondOperand === false || secondOperand === null || (Array.isArray(secondOperand) && secondOperand.length < 1));
    }
    else {
        if (secondOperand === true) {
            return true;
        }
        else if (!Array.isArray(secondOperand)) {
            return false;
        }
        else if (firstOperand.length !== secondOperand.length) {
            return false;
        }

        let result = false;

        for (let i = 0; i < firstOperand.length; i++) {
            let valueItem = firstOperand[i];
            let compareItem = secondOperand[i];

            result = compare(valueItem, compareItem);

            if (!result) {
                break;
            }
        }

        return result;
    }
}

/**
 * Compare a boolean to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
 * │ TRUE    │ TRUE  │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE   │ TRUE  │ FALSE │
 * │ FALSE   │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE    │ FALSE │ TRUE  │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
function compareToBoolean(firstOperand: boolean, secondOperand: any): boolean {
    if (typeof secondOperand === 'boolean') {
        return firstOperand === secondOperand;
    }

    if (typeof secondOperand === 'number') {
        return firstOperand === (secondOperand !== 0);
    }

    if (typeof secondOperand === 'string') {
        if (secondOperand.length > 1) {
            return firstOperand;
        }
        else {
            let float = parseFloat(secondOperand);

            if (!isNaN(float)) {
                return firstOperand === (float !== 0);
            }
            else {
                return firstOperand === (secondOperand.length > 0);
            }
        }
    }

    if (secondOperand === null) {
        return !firstOperand;
    }

    if (Array.isArray(secondOperand)) {
        return firstOperand === (secondOperand.length > 0)
    }

    return false;
}

/**
 * Compare a DateTime to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │  NOW  | LATER |
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┼───────┼───────┤
 * │  NOW    │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │ TRUE  │ FALSE │
 * │  LATER  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │ FALSE │ TRUE  │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┴───────┴───────┘
 */

function compareToDateTime(firstOperand: DateTime, secondOperand: any): boolean {
    if (secondOperand instanceof DateTime) {
        return firstOperand.valueOf() === secondOperand.valueOf();
    }

    return false;
}

/**
 * Compare null to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
 * │ NULL    │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ TRUE  |
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
function compareToNull(value: any) {
    if (typeof value === 'boolean') {
        return (value === false);
    }

    if (typeof value === 'number') {
        return value === 0;
    }

    if (typeof value === 'string') {
        return value.length < 1;
    }

    if (value === null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length < 1;
    }

    return false;
}

/**
 * Compare a number to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
 * │ 1       │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
 * │ 0       │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE   │ TRUE  │ TRUE  │
 * │ -1      │ TRUE  │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE   │ FALSE │ FALSE │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
function compareToNumber(firstOperand: number, secondOperand: any): boolean {
    if (typeof secondOperand === 'number') {
        return firstOperand === secondOperand;
    }

    if (typeof secondOperand === 'boolean') {

        return (firstOperand !== 0) === secondOperand;
    }

    if (secondOperand === null) {
        return firstOperand === 0;
    }

    if (typeof secondOperand === 'string') {
        let float = parseFloat(secondOperand);

        if (float) {
            return firstOperand === float;
        }
        else {
            return firstOperand === 0;
        }
    }

    return false;
}

/**
 * Compare a string to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
 * │ "1"     │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
 * │ "0"     │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
 * │ "-1"    │ TRUE  │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE   │ FALSE │ FALSE │
 * │ ""      │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE   │ FALSE │ TRUE  │
 * │ "php"   │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE   │ TRUE  │ FALSE │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
function compareToString(firstOperand: string, secondOperand: any): boolean {
    if (typeof secondOperand === 'string') {
        return firstOperand === secondOperand;
    }

    if (typeof secondOperand === 'boolean') {
        if (firstOperand.length < 1 || firstOperand === '0') {
            return !secondOperand;
        }

        return secondOperand;
    }

    if (secondOperand === null) {
        return firstOperand.length < 1;
    }

    if (typeof secondOperand === 'number') {
        let float = parseFloat(firstOperand);

        if (float) {
            return secondOperand === float;
        }
        else {
            return secondOperand === 0;
        }
    }

    return false;
}
