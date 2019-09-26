const {iteratorToMap} = require('../../../../../../dist/cjs/lib/helpers/iterator-to-map');

const tap = require('tape');

class valueIterable {
    constructor() {
        this[Symbol.iterator] = function* () {
            yield 'a';
            yield 'b';
        };
    }
}

class keyValueIterable {
    constructor() {
        this.entries = function* () {
            yield ['a', 'b'];
            yield ['c', 'd'];
        };

        this[Symbol.iterator] = this.entries;
    }
}

tap.test('iterator-to-map', function (test) {
    test.test('should support maps', function (test) {
        let entry = new Map([
            ['a', 'b'],
            ['c', 'd']
        ]);

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            ['a', 'b'],
            ['c', 'd']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support sets', function (test) {
        let entry = new Set([
            'a', 'b'
        ]);

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            ['a', 'a'],
            ['b', 'b']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support arrays', function (test) {
        let entry = ['a', 'b'];

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            [0, 'a'],
            [1, 'b']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support custom value iterables', function (test) {
        let entry = new valueIterable();

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            [0, 'a'],
            [1, 'b']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support custom key-value iterables', function (test) {
        let entry = new keyValueIterable();

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            ['a', 'b'],
            ['c', 'd']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support arrays containing arrays', function (test) {
        let entry = ['a', ['b', 'c']];

        let iterable = iteratorToMap(entry);
        let expected = new Map();

        expected.set(0, 'a');
        expected.set(1, ['b', 'c']);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support hashes', function (test) {
        let entry = {a: 'b', c: 'd'};

        let iterable = iteratorToMap(entry);
        let expected = new Map([
            ['a', 'b'],
            ['c', 'd']
        ]);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.end();
});
