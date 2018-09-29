const {TwingErrorLoader} = require('../../../../../../build/lib/error/loader');

const tap = require('tape');

tap.test('TwingErrorLoader', function (test) {
    test.test('constructor', function (test) {
        let error = new TwingErrorLoader('foo', 1, 'bar');

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), 1, 'template line should be set');
        test.same(error.message, 'foo in "bar" at line 1', 'message should be set');

        test.end();
    });

    test.end();
});
