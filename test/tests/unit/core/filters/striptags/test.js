const {twingFilterStriptags} = require('../../../../../../build/core/filters/striptags');

const tap = require('tape');

tap.test('striptags', function (test) {
    test.same(twingFilterStriptags('<div>foo</div>'), 'foo');

    test.end();
});