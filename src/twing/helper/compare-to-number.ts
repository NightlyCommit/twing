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
export function compareNumber(firstOperand: number, secondOperand: any): boolean {
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
