const {cycle} = require('../../../../../../../../dist/cjs/lib/extension/core/functions/cycle');

const tap = require('tape');

tap.test('cycle', function (test) {
    test.same(cycle(1), 1, 'supports non-array input');

    test.end();
});