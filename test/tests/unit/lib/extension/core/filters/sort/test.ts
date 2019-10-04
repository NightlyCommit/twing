import * as tape from 'tape';
import {sort} from "../../../../../../../../src/lib/extension/core/filters/sort";

tape('sort', (test) => {
    try {
        sort(5 as any);

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'The sort filter only works with iterables, got "number".');
    }

    test.end();
});
