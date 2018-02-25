/**
 * Compare a boolean to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
 * │ TRUE    │ TRUE  │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE   │ TRUE  │ FALSE │
 * │ FALSE   │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE    │ FALSE │ TRUE  │
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
export function twingCompareToBoolean(value: boolean, compare: any): boolean {
    if (typeof compare === 'boolean') {
        return value === compare;
    }

    if (typeof compare === 'number') {
        return value === (compare !== 0);
    }

    if (typeof compare === 'string') {
        if (compare.length > 1) {
            return value;
        }
        else {
            let float = parseFloat(compare);

            if (!isNaN(float)) {
                return value === (float !== 0);
            }
            else {
                return value === (compare.length > 0);
            }
        }
    }

    if (compare === null) {
        return !value;
    }

    if (Array.isArray(compare)) {
        return value === (compare.length > 0)
    }

    return false;
}
