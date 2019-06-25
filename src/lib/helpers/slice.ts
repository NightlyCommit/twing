import {isNumber} from "util";

export function slice(map: Map<any, any>, start: number, length: number, preserveKeys: boolean) {
    let result = new Map();
    let index: number = 0;
    let keyIndex: number = 0;

    if (start < 0) {
        start = map.size + start;
    }

    for (let [key, value] of map) {
        if ((index >= start) && (index < start + length)) {
            let newKey;

            // Note that array_slice() will reorder and reset the ***numeric*** array indices by default. [...]
            // see http://php.net/manual/en/function.array-slice.php
            if (isNumber(key)) {
                newKey = preserveKeys ? key : keyIndex;

                keyIndex++;
            }
            else {
                newKey = key;
            }

            result.set(newKey, value);
        }

        if (index >= start + length) {
            break;
        }

        index++;
    }

    return result;
}
