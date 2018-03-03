import {compare} from './compare';

/**
 * Compare an array to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
 * │ []      │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ FALSE |
 * │ ["php"] │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE    │ FALSE │ FALSE |
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
export function compareArray(firstOperand: Array<any>, secondOperand: any): boolean {
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
