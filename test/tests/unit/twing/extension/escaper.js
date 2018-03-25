const TwingExtensionEscaper = require('../../../../../lib/twing/extension/escaper');

const tap = require('tap');

tap.test('extension/escaper', function (test) {
    let extension = new TwingExtensionEscaper.TwingExtensionEscaper();

    test.same(extension.getDefaultStrategy('foo'), 'html');

    test.test('twingRawFilter', function(test) {
       test.same(TwingExtensionEscaper.twingRawFilter('<br/>'), '<br/>');

       test.end();
    });

    test.end();
});