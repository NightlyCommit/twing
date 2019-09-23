const {raw} = require('../../../../../../../../build/lib/extension/core/filters/raw');
const {TwingMarkup} = require('../../../../../../../../build/lib/markup');

const tap = require('tape');

tap.test('raw', function (test) {
    test.same(raw('<br/>'), '<br/>');
    test.same(raw(new TwingMarkup('<br/>', 'utf-8')), '<br/>');

    test.end();
});