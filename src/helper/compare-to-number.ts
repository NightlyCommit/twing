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
export function twingCompareNumber(value: number, compare: any): boolean {
    if (typeof compare === 'number') {
        return value === compare;
    }

    if (typeof compare === 'boolean') {

        return (value !== 0) === compare;
    }

    if (compare === null) {
        return value === 0;
    }

    if (typeof compare === 'string') {
        let float = parseFloat(compare);

        if (float) {
            return value === float;
        }
        else {
            return value === 0;
        }
    }

    return false;
}
