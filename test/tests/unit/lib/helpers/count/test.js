const {count} = require('../../../../../../dist/cjs/lib/helpers/count');

const tap = require('tape');

tap.test('count', function (test) {
    test.same(count(new Map([['a', 1], ['b', 2]])), 2);
    test.same(count(['a', 'b']), 2);
    test.same(count({a: 1, b: 2}), 2);
    test.same(count('a,b'), 0);

    test.end();
});