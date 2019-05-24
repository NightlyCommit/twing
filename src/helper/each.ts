/**
 * Executes the provided function once for each element of an iterable.
 *
 * @param {*} it An iterable
 * @param {Function} cb Function to execute for each element, taking a key and a value as arguments
 * @return void
 */
export function each(it: any, cb: Function): void {
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
