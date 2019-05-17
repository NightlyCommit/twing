const {TwingErrorSyntax} = require('../../../../../../build/lib/error/syntax');

const tap = require('tape');

tap.test('TwingErrorSyntax', function (test) {
    test.test('constructor', function (test) {
        let error = new TwingErrorSyntax('foo', 1, 'bar');

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), 1, 'template line should be set');
        test.same(error.message, 'foo in "bar" at line 1', 'message should be set');

        test.end();
    });

    test.test('addSuggestions', function (test) {
        let error = new TwingErrorSyntax('foo.', 1, 'bar');

        error.addSuggestions('foo', ['foos', 'fo']);

        test.same(error.message, 'foo. Did you mean "fo, foos" in "bar" at line 1?', 'message should be appended with suggestions');

        test.end();
    });

    test.end();
});
