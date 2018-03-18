const tap = require('tap');
const each = require('../../../../../lib/twing/helper/each').each;

class TestIterator {
    constructor() {
        this.position = 0;
    }

    next() {
        let r = this.position < 2 ? {
            done: false,
            value: this.position + 10
        } : {
            done: true
        };

        this.position++;

        return r;
    }
}

tap.test('each', function (test) {
    test.test('supports arrays', async function (test) {
        let actual = {};
        let expected = {
            0: 'a',
            1: 'b',
            2: 1
        };

        await each(['a', 'b', 1], function (key, value) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support arrays');

        test.end();
    });

    test.test('supports iterators', async function (test) {
        let actual = {};
        let expected = {
            0: 10,
            1: 11
        };

        await each(new TestIterator(), function (key, value) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support iterators');

        test.end();
    });

    test.test('supports hashes', async function (test) {
        let actual = {};
        let expected = {
            0: 'a',
            'b': 1,
            'c': 'd'
        };

        await each(expected, function (key, value) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support hashes');

        test.end();
    });

    test.test('supports maps', async function (test) {
        let actual = {};
        let expected = {
            0: 'a',
            'b': 'c',
            'd': 1
        };

        await each(new Map([[0, 'a'], ['b', 'c'], ['d', 1]]), function (key, value) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support maps');

        test.end();
    });

    test.end();
});