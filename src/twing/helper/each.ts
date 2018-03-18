/**
 *
 * @param {*} it An iterable
 * @param {Function} cb A function called on each iteration with a (key, value) pair
 */
export function each(it: any, cb: Function) {
    if (it.entries) {
        for (let [k, v] of it.entries()) {
            cb(k, v);
        }
    }
    else if (typeof it[Symbol.iterator] === 'function') {
        let i: number = 0;

        for (let value of it) {
            cb(i++, value);
        }
    }
    else if (typeof it['next'] === 'function') {
        let i: number = 0;
        let next: any;

        while ((next = it.next()) && !next.done) {
            cb(i++, next.value);
        }
    }
    else {
        for (let k in it) {
            cb(k, it[k]);
        }
    }
}
