/**
 * Compare a boolean to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
 * │ TRUE    │ TRUE  │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE   │ TRUE  │ FALSE │
 * │ FALSE   │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE    │ FALSE │ TRUE  │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
export function compareToBoolean(firstOperand: boolean, secondOperand: any): boolean {
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
