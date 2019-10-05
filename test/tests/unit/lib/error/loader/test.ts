import * as tape from 'tape';
import {TwingErrorLoader} from "../../../../../../src/lib/error/loader";
import {TwingSource} from "../../../../../../src/lib/source";

tape('TwingErrorLoader', (test) => {
    test.test('constructor', (test) => {
        let error = new TwingErrorLoader('foo', 1, new TwingSource('', 'bar'));

        test.same(error.getRawMessage(), 'foo', 'raw message should be set');
        test.same(error.getTemplateLine(), 1, 'template line should be set');
        test.same(error.message, 'foo in "bar" at line 1', 'message should be set');

        test.end();
    });

    test.end();
});
