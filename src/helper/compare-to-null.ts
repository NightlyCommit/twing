/**
 * Compare null to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
 * │ NULL    │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ TRUE  |
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
export function twingCompareToNull(value: any) {
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
}
