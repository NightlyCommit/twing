const {isPureArray} = require('../../../../../../build/lib/helpers/is-pure-array');

const tap = require('tape');

tap.test('is-pure-array', function (test) {
    test.same(isPureArray(new Map([[0, 1], [1, 2]])), true);
    test.same(isPureArray(new Map([[1, 1], [2, 2]])), false);
    test.same(isPureArray(new Map([[1, 1], [0, 2]])), false);
    test.same(isPureArray(new Map([[0, 1], [2, 2]])), false);
    test.same(isPureArray(new Map([['0', 1], [1, 2]])), true);
    test.same(isPureArray(new Map([[0, 1], ['b', 2]])), false);
    test.same(isPureArray(new Map([['a', 1], ['b', 2]])), false);

    test.end();
});