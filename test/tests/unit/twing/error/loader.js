const TwingErrorLoader = require('../../../../../lib/twing/error/loader').TwingErrorLoader;

const tap = require('tap');

tap.test('TwingErrorLoader', function (test) {
    test.test('constructor', function (test) {
        let previous = new Error();
        let error = new TwingErrorLoader('foo', 1, 'bar', previous);

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), false, 'template line should be set');
        test.same(error.message, 'foo in "bar"', 'message should be set');

        test.end();
    });

    test.end();
});
