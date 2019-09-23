const {isCountable} = require('../../../../../../build/lib/helpers/is-countable');

const tap = require('tape');

tap.test('is-countable', function (test) {
    test.test('supports arrays', function (test) {
        test.equals(isCountable(new Map()), true);
        test.equals(isCountable([]), true);
        test.equals(isCountable({}), true);

        test.end();
    });

    test.end();
});