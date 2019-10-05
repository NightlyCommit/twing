import * as tape from 'tape';
import {iteratorToMap} from "../../../../../../src/lib/helpers/iterator-to-map";

class valueIterable {
    * [Symbol.iterator]() {
        yield 'a';
        yield 'b';
    }
}

class keyValueIterable {
    entries: Function;

    constructor() {
        this.entries = function* () {
            yield ['a', 'b'];
            yield ['c', 'd'];
        };
    }

    [Symbol.iterator]() {
        return this.entries;
    }
}

tape('iterator-to-map', (test) => {
    test.test('should support maps', (test) => {
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

    test.test('should support sets', (test) => {
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

    test.test('should support arrays', (test) => {
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

    test.test('should support custom value iterables', (test) => {
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

    test.test('should support custom key-value iterables', (test) => {
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

    test.test('should support arrays containing arrays', (test) => {
        let entry = ['a', ['b', 'c']];

        let iterable = iteratorToMap(entry);
        let expected = new Map();

        expected.set(0, 'a');
        expected.set(1, ['b', 'c']);

        test.same([...iterable.keys()], [...expected.keys()]);
        test.same([...iterable.values()], [...expected.values()]);

        test.end();
    });

    test.test('should support hashes', (test) => {
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
