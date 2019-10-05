import * as tape from 'tape';
import {column} from "../../../../../../../../src/lib/extension/core/filters/column";

tape('column', (test) => {
    try {
        column('foo', 'bar');

        test.fail('Should throw an error');
    } catch (e) {
        test.same(e.getMessage(), 'The column filter only works with arrays or "Traversable", got "string" as first argument.');
    }

    test.end();
});
