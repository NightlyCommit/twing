import twingCompare from './compare';

/**
 * Compare an array to something else by conforming to PHP loose comparisons rules
 * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
 * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
 * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
 * │ []      │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ FALSE |
 * │ ["php"] │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE    │ FALSE │ FALSE |
 * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
 */
export default function twingCompareArray(value: Array<any>, compare: any): boolean {
    if (value.length < 1) {
        return (compare === false || compare === null || (Array.isArray(compare) && compare.length < 1));
    }
    else {
        if (compare === true) {
            return true;
        }
        else if (!Array.isArray(compare)) {
            return false;
        }
        else if (value.length !== compare.length) {
            return false;
        }

        let result = false;

        for (let i = 0; i < value.length; i++) {
            let valueItem = value[i];
            let compareItem = compare[i];

            result = twingCompare(valueItem, compareItem);

            if (!result) {
                break;
            }
        }

        return result;
    }
}