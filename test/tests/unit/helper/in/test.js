const {isIn} = require('../../../../../build/helper/is-in');

const tap = require('tape');

class TestIterator {
    constructor(values, keys, allowValueAccess, maxPosition) {
        this.map = values;
        this.mapKeys = keys;
        this.position = 0;
        this.allowValueAccess = allowValueAccess;
        this.maxPosition = maxPosition === false ? values.length + 1 : maxPosition;
    }

    next() {
        return this.position < this.map.size ? {
            done: false,
            value: [...this.map.values()][this.position++]
        } : {
            done: true
        };
    }

    rewind() {
        this.position = 0;
    }
}

tap.test('in', function (test) {
    let map = new Map([
        [0, 1],
        [1, 2],
        ['a', 3],
        [2, 5],
        [3, 6],
        [4, 7]
    ]);

    let keys = [...map.keys()];

    let inFilterCases = [
        [true, 1, map],
        [true, '3', map],
        [true, '3', 'abc3def'],
        [true, 1, new TestIterator(map, keys, true, 1)],
        [true, '3', new TestIterator(map, keys, true, 3)],
        [false, 4, map],
        [false, 4, new TestIterator(map, keys, true)],
        [false, 1, 1]
    ];

    for (let inFilterCase of inFilterCases) {
        test.same(isIn(inFilterCase[1], inFilterCase[2]), inFilterCase[0]);
    }

    test.same(isIn(5, {foo: 1, bar: 5}), true);

    test.end();
});
