const {twingRawFilter} = require("../../../../../../dist/lib/extension/escaper");
const {TwingExtensionEscaper} = require('../../../../../../dist/index');

const tap = require('tape');

tap.test('extension/escaper', function (test) {
    let extension = new TwingExtensionEscaper();

    test.same(extension.getDefaultStrategy('foo'), 'html');

    test.test('twingRawFilter', function(test) {
       test.same(twingRawFilter('<br/>'), '<br/>');

       test.end();
    });

    test.end();
});