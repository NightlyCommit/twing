import {Test} from "tape";
import iteratorToMap from '../../../../src/helper/iterator-to-map';

const tap = require('tap');

class valueIterable {
    [Symbol.iterator] = function* () {
        yield 'a';
        yield 'b';
    };
}

class keyValueIterable {
    entries = function* () {
        yield ['a', 'b'];
        yield ['c', 'd'];
    };

    [Symbol.iterator] = this.entries;
}

tap.test('iterator-to-map', function (test: Test) {
    test.test('should support maps', function (test: Test) {
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

    test.test('should support sets', function (test: Test) {
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

    test.test('should support arrays', function (test: Test) {
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

    test.test('should support custom value iterables', function (test: Test) {
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

    test.test('should support custom key-value iterables', function (test: Test) {
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

    test.test('should support arrays containing arrays', function (test: Test) {
        let entry = ['a', ['b', 'c']];

        let iterable = iteratorToMap(entry);
        let expected = new Map();

        expected.set(0, 'a');
        expected.set(1, ['b', 'c']);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support hashes', function (test: Test) {
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