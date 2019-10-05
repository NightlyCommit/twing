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
    test.test('supports arrays', (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            1: 'b',
            2: 1
        };

        iterate(['a', 'b', 1], function (key: number, value: any) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support arrays');

        test.end();
    });

    test.test('supports iterators', (test) => {
        let actual: any = {};
        let expected = {
            0: 10,
            1: 11
        };

        iterate(new TestIterator(), function (key: number, value: any) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support iterators');

        test.end();
    });

    test.test('supports hashes', (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            'b': 1,
            'c': 'd'
        };

        iterate(expected, function (key: any, value: any) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support hashes');

        test.end();
    });

    test.test('supports maps', (test) => {
        let actual: any = {};
        let expected = {
            0: 'a',
            'b': 'c',
            'd': 1
        };

        iterate(new Map<any, any>([[0, 'a'], ['b', 'c'], ['d', 1]]), function (key: any, value: any) {
            actual[key] = value;
        });

        test.same(actual, expected, 'should support maps');

        test.end();
    });

    test.end();
});