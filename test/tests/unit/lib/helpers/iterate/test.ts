import * as tape from 'tape';
import {iterate} from "../../../../../../src/lib/helpers/iterate";

class TestIterator {
    position: number;

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

tape('each', (test) => {
    test.test('supports arrays', async (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            1: 'b',
            2: 1
        };

        await iterate(['a', 'b', 1], function (key: number, value: any) {
            actual[key] = value;

            return Promise.resolve();
        });

        test.same(actual, expected, 'should support arrays');

        test.end();
    });

    test.test('supports iterators', async (test) => {
        let actual: any = {};
        let expected = {
            0: 10,
            1: 11
        };

        await iterate(new TestIterator(), function (key: number, value: any) {
            actual[key] = value;

            return Promise.resolve();
        });

        test.same(actual, expected, 'should support iterators');

        test.end();
    });

    test.test('supports hashes', async (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            'b': 1,
            'c': 'd'
        };

        await iterate(expected, function (key: any, value: any) {
            actual[key] = value;

            return Promise.resolve();
        });

        test.same(actual, expected, 'should support hashes');

        test.end();
    });

    test.test('supports maps', async (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            'b': 'c',
            'd': 1
        };

        await iterate(new Map<any, any>([[0, 'a'], ['b', 'c'], ['d', 1]]), function (key: any, value: any) {
            actual[key] = value;

            return Promise.resolve();
        });

        test.same(actual, expected, 'should support maps');

        test.end();
    });

    test.end();
});
