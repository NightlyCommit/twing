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
export function twingCompareString(value: string, compare: any): boolean {
    if (typeof compare === 'string') {
        return value === compare;
    }

    if (typeof compare === 'boolean') {
        if (value.length < 1 || value === '0') {
            return !compare;
        }
        else if (value.length > 0) {
            return compare;
        }
    }

    if (compare === null) {
        return value.length < 1;
    }

    if (typeof compare === 'number') {
        let float = parseFloat(value);

        if (float) {
            return compare === float;
        }
        else {
            return compare === 0;
        }
    }

    return false;
}
