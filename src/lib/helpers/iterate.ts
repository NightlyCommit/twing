export type IterateCallback = (k: any, v: any) => Promise<void>;

/**
 * Executes the provided function once for each element of an iterable.
 *
 * @param {*} it An iterable
 * @param {IterateCallback} cb Callback to execute for each element, taking a key and a value as arguments
 *
 * @return {void}
 */
export async function iterate(it: any, cb: IterateCallback): Promise<void> {
    if (it.entries) {
        for (let [k, v] of it.entries()) {
            await cb(k, v);
        }
    }
    else if (typeof it[Symbol.iterator] === 'function') {
        let i: number = 0;

        for (let value of it) {
            await cb(i++, value);
        }
    }
    else if (typeof it['next'] === 'function') {
        let i: number = 0;
        let next: any;

        while ((next = it.next()) && !next.done) {
            await cb(i++, next.value);
        }
    }
    else {
        for (let k in it) {
            await cb(k, it[k]);
        }
    }
}
