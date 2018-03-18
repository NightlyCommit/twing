import {isNumber} from "util";

export class TwingMap<K, V> extends Map<any, any> {
    push(item: any) {
        this.set(this.size, item);

        return this;
    }

    first() {
        return Array.from(this.values())[0];
    }

    merge(map: TwingMap<any, any>): TwingMap<any, any> {
        let result = new TwingMap();

        let index = 0;

        for (let [key, value] of this) {
            if (typeof key === 'number') {
                key = index++;
            }

            result.set(key, value);
        }

        for (let [key, value] of map) {
            if (typeof key === 'number') {
                key = index++;
            }

            result.set(key, value);
        }

        return result;
    }

    chunk(size: number, preserveKeys: boolean = false) {
        let result: Array<TwingMap<any, any>> = [];
        let count = 0;
        let map;

        for (let [k, v] of this) {
            if (!map) {
                map = new TwingMap();
                result.push(map);
            }

            map.set(k, v);

            count++;

            if (count >= size) {
                count = 0;
                map = null;
            }
        }

        return result;
    }

    fill(start: number, length: number, value: any) {
        for (let i = start; i < length; i++) {
            this.set(i, value);
        }
    }

    join(separator: string) {
        return [...this.values()].join(separator);
    }

    slice(start: number, length: number, preserveKeys: boolean = false) {
        let result = new TwingMap();
        let index: number = 0;
        let keyIndex: number = 0;

        if (start < 0) {
            start = this.size + start;
        }

        for (let [key, value] of this) {
            if ((index >= start) && (index < start + length)) {
                let newKey;

                // Note that array_slice() will reorder and reset the ***numeric*** array indices by default. [...]
                // see http://php.net/manual/en/function.array-slice.php
                if (isNumber(key)) {
                    newKey = preserveKeys ? key : keyIndex;
                }
                else {
                    newKey = key;
                }

                result.set(newKey, value);

                keyIndex++;
            }

            if (index >= start + length) {
                break;
            }

            index++;
        }

        return result;
    }

    /**
     * Reverse the Map.
     *
     * @param {boolean} preserveKeys
     *
     * @returns TwingMap
     */
    reverse(preserveKeys: boolean = false) {
        let result = new TwingMap();
        let keys = [...this.keys()];

        for (let i = (keys.length - 1); i >= 0; i--) {
            let key = keys[i];

            result.set(key, this.get(key));
        }

        return result;
    }

    /**
     *
     * @param {Function} handler
     * @returns {TwingMap}
     */
    sort(handler: any = null) {
        let sortedMap = new TwingMap();

        let keys: Array<any> = [].fill(null, 0, this.size);
        let sortedValues = [...this.values()].sort(handler);

        for (let [key, value] of this) {
            let index = sortedValues.indexOf(value);

            keys[index] = key;
        }

        for (let key of keys) {
            sortedMap.set(key, this.get(key));
        }

        this.clear();

        for (let [key, value] of sortedMap) {
            this.set(key, value);
        }

        return this;
    }

    /**
     *
     * @param {Function} handler
     * @returns {TwingMap}
     */
    sortByKeys(handler: any = null) {
        let sortedMap = new Map();

        let sortedKeys = [...this.keys()].sort(handler);

        for (let key of sortedKeys) {
            sortedMap.set(key, this.get(key));
        }

        this.clear();

        for (let [key, value] of sortedMap) {
            this.set(key, value);
        }

        return this;
    }

    includes(thing: any): boolean {
        for (let [key, value] of this) {
            if (value === thing) {
                return true;
            }
        }

        return false;
    }

    clone() {
        return this.merge(new TwingMap());
    }
}
