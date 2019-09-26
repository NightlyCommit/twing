const {min} = require('../../../../../../../../dist/cjs/lib/extension/core/functions/min');

const tap = require('tape');

tap.test('min', function (test) {
    test.test('supports multiple parameters', function (test) {
        test.same(min(1, 3, 2), 1);

        test.end();
    });

    test.end();
});