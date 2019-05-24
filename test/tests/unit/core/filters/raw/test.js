const {twingFilterRaw} = require('../../../../../../build/core/filters/raw');

const tape = require('tape');

tape.test('raw', function (test) {
    test.same(twingFilterRaw('<br/>'), '<br/>');

    test.end();
});
