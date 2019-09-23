const {merge} = require('../../../../../../build/lib/helpers/merge');

const tap = require('tape');

tap.test('merge', function (test) {
    test.test('returns null when one of the arguments is null or undefined', function (test) {
        test.same(merge(null, []), null);
        test.same(merge(undefined, []), null);
        test.same(merge([], null), null);
        test.same(merge([], undefined), null);

        test.end();
    });

    test.end();
});