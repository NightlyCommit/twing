const {striptags} = require('../../../../../../../../build/lib/extension/core/filters/striptags');

const tap = require('tape');

tap.test('striptags', function (test) {
    test.same(striptags('<br/>'), '');

    test.end();
});