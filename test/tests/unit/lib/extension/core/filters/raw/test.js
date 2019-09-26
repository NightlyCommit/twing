const {raw} = require('../../../../../../../../dist/cjs/lib/extension/core/filters/raw');
const {TwingMarkup} = require('../../../../../../../../dist/cjs/lib/markup');

const tap = require('tape');

tap.test('raw', function (test) {
    test.same(raw('<br/>'), '<br/>');
    test.same(raw(new TwingMarkup('<br/>', 'utf-8')), '<br/>');

    test.end();
});