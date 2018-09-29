const {chunk} = require('../../../../../../dist');

const tap = require('tape');

tap.test('chunk', function (test) {
    test.test('supports arrays', function (test) {
        test.same(chunk(new Map([['foo', 'bar'], ['bar', 'foo']]), 1), [new Map([[0, 'bar']]), new Map([[0, 'foo']])]);
        test.same(chunk(new Map([['foo', 'bar'], ['bar', 'foo']]), 1, true), [new Map([['foo', 'bar']]), new Map([['bar', 'foo']])]);

        test.end();
    });

    test.end();
});