import * as tape from 'tape';
import {TwingErrorSyntax} from "../../../../../../src/lib/error/syntax";
import {TwingSource} from "../../../../../../src/lib/source";

tape('TwingErrorSyntax', (test) => {
    test.test('constructor', (test) => {
        let error = new TwingErrorSyntax('foo', 1, new TwingSource('', 'bar'));

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), 1, 'template line should be set');
        test.same(error.message, 'foo in "bar" at line 1', 'message should be set');

        test.end();
    });

    test.test('addSuggestions', (test) => {
        let error = new TwingErrorSyntax('foo.', 1, new TwingSource('', 'bar'));

        error.addSuggestions('foo', ['foos', 'fo']);

        test.same(error.message, 'foo. Did you mean "fo, foos" in "bar" at line 1?', 'message should be appended with suggestions');

        test.end();
    });

    test.end();
});
