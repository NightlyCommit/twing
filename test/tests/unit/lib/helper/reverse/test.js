const {reverse} = require('../../../../../../build');

const tap = require('tape');

tap.test('reverse', function (test) {
    let map = new Map([[0, 'foo'], ['bar', 'bar']]);

    test.same(reverse(map), new Map([[0, 'bar'], [1, 'foo']]));
    test.same(reverse(map, false), new Map([[0, 'bar'], [1, 'foo']]));
    test.same(reverse(map, true), new Map([['bar', 'bar'], [0, 'foo']]));

    test.end();
});