const {empty} = require('../../../../../../../../dist/cjs/lib/extension/core/tests/empty');

const tap = require('tape');

tap.test('empty', function (test) {
    test.true(empty({}));
    test.true(empty({
        toString: () => {
            return '';
        }
    }));
    test.false(empty({foo: ''}));
    test.false(empty({
        toString: () => {
            return 'foo';
        }
    }));

    test.end();
});